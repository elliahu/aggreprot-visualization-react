import React from 'react';
import ProfileViewer from './ProfileViewer';
import './App.css';
import { makeChart, makeChartData } from 'protein_visualization';
import StructureViewer from './StructureViewer';
import {type LoadProteinParams} from '@loschmidt/molstar';
import { type SelectedResidue, type makeChartConfig } from "protein_visualization";


interface IProps {
  mapSelectedResidues(input: SelectedResidue): SelectedResidue,
  chartData: makeChartData,
  loadProteins: LoadProteinParams[]
}

interface IState {
  chartFunctions: ReturnType<typeof makeChart> | null,
  selectedFromProfile: Record<string | number, boolean>,
  selectedFromStructure: Record<string | number, boolean>,
}

class Aggreprot extends React.Component<IProps, IState> {

  molstarViewerComponent = React.createRef<StructureViewer>();

  config: makeChartConfig = {
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
    onResidueSelectedFromProfile: (positions: SelectedResidue[]) => {
      console.log(`${positions.length} residues were toggled using aggregation profile, structure viewer will be updated`);
      positions.forEach((position) => {
        this.onResidueSelectedFromProfile(position.index, position.selected, position.protein, position.chain);
      });
    },
    columnHighlight: true, // highlight columns on mouse hover
    displayThresholdLineInRanger: true,
    rangerTitle: 'Ranger',
    profilePlotTitle: 'Aggregation profile',
    sequencePlotTitle: 'Sequence',
  }

  state: IState = {
    chartFunctions: null,
    selectedFromProfile: {},
    selectedFromStructure: {},
  }

  onResidueSelectedFromProfile = (position: number, selected: boolean, label: string, chain?: string) => {
    this.setState({
      selectedFromProfile: {
        ...this.state.selectedFromProfile,
        [position]: selected,
      }
    });
    if (this.molstarViewerComponent.current) {

      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          label,
          {
            chain: (chain == null) ? "A" : chain,
            position: position,
            color: "#FF0000",
            focus: true,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition(label, position, (chain == null) ? "A" : chain);
      }
    } else {
      console.warn('this.molstarViewerComponent.current is not defined');
    }
  }

  onResidueSelectedFromStructure = (position: number, selected: boolean, label: string, chain: string) => {
    this.setState({
      selectedFromStructure: {
        ...this.state.selectedFromStructure,
        [position]: selected,
      }
    });
    if (this.molstarViewerComponent.current) {
      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          label,
          {
            chain: chain,
            position: position,
            color: "#FFFF00",
            focus: false,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition(label, position, chain);
      }
    } else {
      console.warn('this.molstarViewerComponent.current is not defined');
    }
    if (this.state.chartFunctions) {
      this.state.chartFunctions.onResidueSelectedFromStructure(position, selected, label);
    }
  }

  onResidueClickedInStructure = (position: number, label: string, chain: string) => {
    const selected = !this.state.selectedFromStructure[position];
    this.onResidueSelectedFromStructure(position, selected, label, chain);
  }

  render() {
    return <>
      <ProfileViewer
        config={this.config}
        data={this.props.chartData}
        chartFunctions={this.state.chartFunctions}
        setChartFunctions={chartFunctions => this.setState({ chartFunctions })}
        onResidueSelectedFromProfile={this.onResidueSelectedFromProfile}
      />
      <StructureViewer
        onResidueClickedInStructure={this.onResidueClickedInStructure}
        loadProteins={this.props.loadProteins}
        ref={this.molstarViewerComponent}
      />
    </>;
  }
}

export default Aggreprot;
