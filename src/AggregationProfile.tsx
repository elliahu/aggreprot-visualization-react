import React from "react";
import "protein_visualization/dist/uPlot.min.css";
import "protein_visualization/datachart.css";
import { fetchData, makeChart, type makeChartConfig, type makeChartData} from "protein_visualization";

// name of the file that will be fetched
let sourceFile = process.env.PUBLIC_URL + './datachart_data/DummyData.json';

interface IProps {
    chartFunctions: ReturnType<typeof makeChart> | null,
    setChartFunctions (chartFunctions: ReturnType<typeof makeChart>): void,
    onResidueSelectedFromProfile (position: number, selected: boolean): void,
}

interface IState {
    thresholdValue:number,
}

class AggregationProfile extends React.Component<IProps> {

    state: IState = {
        thresholdValue: 0.5,
    }

    aggregationProfileRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        let config: makeChartConfig = {
            enableControls: true, // enables or disables chart controls
            onAreaSelected: function (min, max) { }, // area selected callback fired when area is selected
            labelBreakPoint: 8, // min width between x labels
            grid: {
                gridColor: '#dedede',
                width: 1,
                dash: []
            },
            ticks: {
                width: 1,
                size: 10,
                dash: []
            },
            onResidueSelectedFromProfile: (position: number, selected: boolean) => {
                console.log(`residue ${position} was toggled (selected=${selected ? 'true' : 'false'}) using aggregation profile, structure viewer will be updated`);
                this.props.onResidueSelectedFromProfile(position, selected);
            },
            columnHighlight: true, // highlight columns on mouse hover
            displayThresholdLineInRanger: true,
            rangerTitle: 'Ranger',
            profilePlotTitle: 'Aggregation profile',
            sequencePlotTitle: 'Sequence',
        }

        // Using json file:
        
        // fetch the file then use the data from the result
        fetchData(sourceFile, 'json').then((result) => {
            setTimeout(() => {
                const chartFunctions = makeChart(result, config, this.aggregationProfileRef.current!);
                this.props.setChartFunctions(chartFunctions);
            });
        });

        // Using raw data:
        /*
        const data: makeChartData = {
            dataframes:
            [
                // Protein 1
                {
                    indexes: [0,1,2,3,4,5,6,7,8,9], // x indexes
                    threshold: [0.5,null,null,null,null,null,null,null,null,0.5], // threshold
                    labels: ['A','B',null,'D','E','F','G','H','I','J'], // labels (sequence)
                    agg: Array.from({length: 10}, () => Math.random()), // AGG
                    asa: Array.from({length: 10}, () => Math.random()), // ASA
                },
                // Protein 2 
                {
                    indexes: [0,1,2,3,4,5,6,7,8,9], // x indexes
                    threshold: [0.5,null,null,null,null,null,null,null,null,0.5], // threshold
                    labels: ['A','B',null,'D','E','F','G','H','I','J'], // labels (sequence)
                    agg: Array.from({length: 10}, () => Math.random()), // AGG
                    asa: Array.from({length: 10}, () => Math.random()), // ASA
                }
            ]
        };

        const chartFunctions = makeChart(data, config, this.aggregationProfileRef.current!);
        this.props.setChartFunctions(chartFunctions); */
        
    }

    render() {
        return(
            <div>
                <input type="range" min="0" max="1" step="0.01" value={this.state.thresholdValue} onInput={(event)=>{
                    this.state.thresholdValue = Number.parseFloat((event.target as HTMLInputElement).value);
                    this.props.chartFunctions?.setThresholdValue(this.state.thresholdValue);
                }}></input>
                <div id="aggregation-profile" ref={this.aggregationProfileRef} />
            </div>
        ); 
    }
}

export default AggregationProfile
