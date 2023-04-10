import React from 'react';
import ProfileViewer from './ProfileViewer';
import './Aggreprot.css';
import { makeChart, makeChartData } from 'protein_visualization';
import StructureViewer from './StructureViewer';
import { SelectedResidue, makeChartConfig } from "protein_visualization";
import { LoadProteinParams } from '@loschmidt/molstar';

interface IProps {
  mapSelectedResidues(input: SelectedResidue, direction?: number): SelectedResidue,
  chartData: makeChartData,
  chartConfig: makeChartConfig,
  loadProteins: LoadProteinParams[]
}

interface IState {
  chartFunctions: ReturnType<typeof makeChart> | null,
  selectedFromProfile: Record<string | number, boolean>, 
  selectedFromStructure: Record<string | number, boolean>,
}

class Aggreprot extends React.Component<IProps, IState> {

  molstarViewerComponent = React.createRef<StructureViewer>();

  state: IState = {
    chartFunctions: null,
    selectedFromProfile: {},
    selectedFromStructure: {},
  }

  componentDidMount(): void {
    // override the onResidueSelectedFromProfile method
    this.props.chartConfig.onResidueSelectedFromProfile = (positions: SelectedResidue[]) => {
      console.log(`${positions.length} residues were toggled using aggregation profile, structure viewer will be updated`);
      positions.forEach((position) => {
        this.onResidueSelectedFromProfile(position.index, position.selected, position.protein, position.chain);
      });
    };
  }

  onResidueSelectedFromProfile = (position: number, selected: boolean, label: string, chain?: string) => {
    this.setState({
      selectedFromProfile: {
        ...this.state.selectedFromProfile,
        [position]: selected,
      }
    });
    if (this.molstarViewerComponent.current) {
      let mappedPosition = this.props.mapSelectedResidues({index: position, selected: selected, protein: label,chain: chain});
      
      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          mappedPosition.protein, // label
          {
            chain: (mappedPosition.chain == null) ? "A" : mappedPosition.chain,
            position: mappedPosition.index,
            color: "#FF0000",
            focus: true,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition(mappedPosition.protein, mappedPosition.index, (mappedPosition.chain == null) ? "A" : mappedPosition.chain);
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
    let mappedPosition = this.props.mapSelectedResidues({index: position, selected: selected, protein: label,chain: chain});
    if (this.molstarViewerComponent.current) {
      if (selected) {
        this.molstarViewerComponent.current.selectPosition(
          mappedPosition.protein,
          {
            chain: (mappedPosition.chain == null)? "A": mappedPosition.chain,
            position: mappedPosition.index,
            color: "#FFFF00",
            focus: false,
          }
        )
      } else {
        this.molstarViewerComponent.current.deselectPosition(mappedPosition.protein, mappedPosition.index, (mappedPosition.chain == null)? "A": mappedPosition.chain);
      }
    } else {
      console.warn('this.molstarViewerComponent.current is not defined');
    }

    if (this.state.chartFunctions) {
      this.state.chartFunctions.onResidueSelectedFromStructure(mappedPosition.index, mappedPosition.selected, mappedPosition.protein);
    }
  }

  onResidueClickedInStructure = (position: number, label: string, chain: string) => {
    const selected = !this.state.selectedFromStructure[position];
    this.onResidueSelectedFromStructure(position, selected, label, chain);
  }

  render() {
    return <>
      <ProfileViewer
        config={this.props.chartConfig}
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
