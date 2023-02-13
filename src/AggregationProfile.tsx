import React from "react";
import "protein_visualization/dist/uPlot.min.css";
import "protein_visualization/datachart.css";
import { fetchData, makeChart, type makeChartConfig} from "protein_visualization";

// name of the file that will be fetched
let sourceFile = process.env.PUBLIC_URL + './datachart_data/DummyData.json';

interface IProps {
    chartFunctions: ReturnType<typeof makeChart> | null,
    setChartFunctions (chartFunctions: ReturnType<typeof makeChart>): void,
    onResidueSelectedFromProfile (position: number, selected: boolean): void,
}

interface IState {
    // selectedPositions: Record<string, boolean>,
}

class AggregationProfile extends React.Component<IProps> {

    state: IState = {
        // selectedPositions: {},
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
                // behaviour:
                // 1. user selects residue using aggregation profile (will be implemented in datachart.js)
                // 2. right after the residue is selected, this function onResidueSelectedFromProfile is called
                // 3. this function will tell structure viewer to show the residue as selected
                console.log(`residue ${position} was toggled (selected=${selected ? 'true' : 'false'}) using aggregation profile, structure viewer will be updated`);
                this.props.onResidueSelectedFromProfile(position, selected);
            },
            columnHighlight: true, // highlight columns on mouse hover
            displayThresholdLineInRanger: true,
            rangerTitle: 'Ranger',
            profilePlotTitle: 'Aggregation profile',
            sequencePlotTitle: 'Sequence',
        }

        // fetch the file then use the data from the result
        fetchData(sourceFile, 'json').then((result) => {
            // is setTimeout necessary?
            setTimeout(() => {
                const chartFunctions = makeChart(result, config, this.aggregationProfileRef.current!);
                this.props.setChartFunctions(chartFunctions);
            });
        });
    }

    render() {
        return <div id="aggregation-profile" ref={this.aggregationProfileRef} />
    }
}

export default AggregationProfile
