import React from 'react';
import AggregationProfile from './AggregationProfile';
import './App.css';
import { makeChart } from 'protein_visualization';
import MolstarViewer from './MolstarViewer';
import {type SelectedResidue} from "protein_visualization";


interface IState {
  chartFunctions: ReturnType<typeof makeChart> | null,
  selectedFromProfile: Record<string | number, boolean>,
  selectedFromStructure: Record<string | number, boolean>,
}

class App extends React.Component<{}, IState> {

  molstarViewerComponent = React.createRef<MolstarViewer>();

  state: IState = {
    chartFunctions: null,
    selectedFromProfile: {},
    selectedFromStructure: {},
  }

  onResidueSelectedFromProfile = (position: number, selected: boolean) => {
    this.setState({
      selectedFromProfile: {
        ...this.state.selectedFromProfile,
        [position]: selected,
      }
    });
    if (this.molstarViewerComponent.current) {
      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          'cdk4',
          {
            chain: "A",
            position: position,
            color: "#FF0000",
            focus: true,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition('cdk4', position, "A");
      }
    } else {
      console.warn('this.molstarViewerComponent.current is not defined');
    }
  }

  onResidueSelectedFromStructure = (position: number, selected: boolean) => {
    this.setState({
      selectedFromStructure: {
        ...this.state.selectedFromStructure,
        [position]: selected,
      }
    });
    if (this.molstarViewerComponent.current) {
      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          'cdk4',
          {
            chain: "A",
            position: position,
            color: "#FFFF00",
            focus: false,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition('cdk4', position, "A");
      }
    } else {
      console.warn('this.molstarViewerComponent.current is not defined');
    }
    if (this.state.chartFunctions) {
      (this.state.chartFunctions as any).onResidueSelectedFromStructure(position, selected);
    }
  }

  onResidueClickedInStructure = (position: number) => {
    const selected = !this.state.selectedFromStructure[position];
    this.onResidueSelectedFromStructure(position, selected);
  }

  render() {
    return <>
      <AggregationProfile
        chartFunctions={this.state.chartFunctions}
        setChartFunctions={chartFunctions => this.setState({ chartFunctions })}
        onResidueSelectedFromProfile={this.onResidueSelectedFromProfile}
      />
      <MolstarViewer
        onResidueClickedInStructure={this.onResidueClickedInStructure}
        ref={this.molstarViewerComponent}
      />
    </>;
  }
}

export default App;
