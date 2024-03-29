import React from "react";
import "@matejelias/datachart/datachart.css";
import { fetchData, makeChart, type makeChartConfig, type makeChartData, type SelectedResidue } from "@matejelias/datachart"


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

    // This is basically a wrapper for @matejelias/datachart library
    render() {
        return (
            <div>
                <div className="profile-viewer" ref={this.aggregationProfileRef} />
            </div>
        );
    }
}

export default ProfileViewer;
export { type SelectedResidue, fetchData, datachart, type makeChartData, type makeChartConfig } from '@matejelias/datachart';
