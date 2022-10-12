import React from "react";
import "./datachart/dist/uPlot.min.css";
import "./datachart/datachart.css";
import { fetchDataCSV, makeChart } from "./datachart/datachart";

// name of the csv file that will be fetched
let csv = process.env.PUBLIC_URL + '/datachart_data/avg_Maternal_protein_pumilio.csv';

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
        // create an optional config to configure chart
        let config = {
            enableControls: true, // displays controls at the top
            onAreaSelected: (min, max) => console.log(`area selected [${min}, ${max}]`), // area selected callback
            displayThresholdLineInRanger: true, // display / hide threshold line in ranger
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
        }

        // fetch the file then use the data from the result
        fetchDataCSV(csv).then((result) => {
            // is setTimeout necessary?
            setTimeout(() => {
                const chartFunctions = makeChart(result!.data, config, this.aggregationProfileRef.current!);
                this.props.setChartFunctions(chartFunctions);
            });
        });
    }

    render() {
        return <div id="aggregation-profile" ref={this.aggregationProfileRef} />
    }
}

export default AggregationProfile
