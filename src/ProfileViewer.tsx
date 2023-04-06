import React from "react";
import "protein_visualization/external/uPlot.min.css";
import "protein_visualization/datachart.css";
import { fetchData, makeChart, type makeChartConfig, type makeChartData, type SelectedResidue } from "protein_visualization";


interface IProps {
    chartFunctions: ReturnType<typeof makeChart> | null,
    config: makeChartConfig,
    data: makeChartData,
    setChartFunctions(chartFunctions: ReturnType<typeof makeChart>): void,
    onResidueSelectedFromProfile(position: number, selected: boolean, label: string, chain?: string): void,
}

interface IState {
    thresholdValue: number,
}

class ProfileViewer extends React.Component<IProps> {

    state: IState = {
        thresholdValue: 0.5,
    }

    aggregationProfileRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        const chartFunctions = makeChart(this.props.data, this.props.config, this.aggregationProfileRef.current!);
        this.props.setChartFunctions(chartFunctions);
    }

    render() {
        return (
            <div>
                <input type="range" min="0" max="1" step="0.01" value={this.state.thresholdValue} onInput={(event) => {
                    this.state.thresholdValue = Number.parseFloat((event.target as HTMLInputElement).value);
                    this.props.chartFunctions?.setThresholdValue(this.state.thresholdValue);
                }}></input>

                <div id="aggregation-profile" ref={this.aggregationProfileRef} />
            </div>
        );
    }
}

export default ProfileViewer
