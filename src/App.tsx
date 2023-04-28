import React from 'react';
import { Aggreprot } from './components';
import { SelectedResidue, makeChartConfig, makeChartData } from '@matejelias/datachart';
import { LoadProteinParams } from '@loschmidt/molstar';
import './App.css'

interface IState {
    thresholdValue: number,
    yRangeVal: string
}

interface IProps {
    data2D: makeChartData,
    data3D: LoadProteinParams[]
}

class App extends React.Component<IProps, IState> {
    aggreprotComponent = React.createRef<Aggreprot>();

    state: IState = {
        thresholdValue: 0.5,
        yRangeVal: '0,1'
    }

    render() {
        return <>
            <div id='module-controls'>
                <input type="range" min="0" max="1" step="0.01" value={this.state.thresholdValue} onInput={(event) => {
                    this.setState({thresholdValue:  Number.parseFloat((event.target as HTMLInputElement).value)});
                    this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.setThresholdValue(this.state.thresholdValue);
                }}></input>
                <button onClick={(event) => {
                    this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.toggleVisibility(this.props.data3D[0].label);
                }}>Show/hide protein 1</button>
                <button onClick={(event) => {
                    this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.toggleVisibility(this.props.data3D[1].label);
                }}>Show/hide protein 2</button>
                <button onClick={(event) => {
                    this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.displaySequenceAsXLabels(this.props.data3D[0].label);
                }}>Display protein 1 as labels</button>
                <button onClick={(event) => {
                    this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.displaySequenceAsXLabels(this.props.data3D[1].label);
                }}>Display protein 2 as labels</button>
                <input value={this.state.yRangeVal} onInput={(event) => {
                    this.setState({yRangeVal: (event.target as HTMLInputElement).value});
                }}></input>
                <button onClick={(event) => {
                    let s = this.state.yRangeVal.split(',');
                    let min = parseFloat(s[0]);
                    let max = parseFloat(s[1]);
                    if(!isNaN(min) && !isNaN(max)){
                        this.aggreprotComponent.current?.profileViewerComponent.current?.props.chartFunctions?.setYRange(min,max);
                    }
                }}>Set Y Range</button>
            </div>
            <div id='module'>
                <Aggreprot
                    mapSelectedResidues={(input, direction) => {
                        return input;
                    }}
                    profileData={this.props.data2D}
                    profileConfig={{
                        debug: true,
                        legendAsTooltip: false // POI change to true if legend should float
                    }}
                    structureData={this.props.data3D}
                    structureConfig={{
                        viewerOptions: {
                            layoutIsExpanded: false,
                            layoutShowControls: true,
                            layoutShowRemoteState: false,
                            layoutShowSequence: true,
                            layoutShowLog: false,
                            layoutShowLeftPanel: false,
                            layoutShowStructure: false,

                            viewportShowExpand: true,
                            viewportShowControls: true,
                            viewportShowSettings: true,
                            viewportShowSelectionMode: true,
                            viewportShowAnimation: true,
                        },
                        backgroundColor: 0xffffff,
                        selectColor: 0x0000ff
                    }}
                    ref={this.aggreprotComponent}
                />
            </div>
            <div id='tutorial'>
                <p>Návod a popis ovládání k dispozici v README.md souboru.</p>
            </div>
        </>;
    }
}
export default App;