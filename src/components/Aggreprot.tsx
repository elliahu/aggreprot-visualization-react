import React from 'react';
import ProfileViewer from './ProfileViewer';
import './Aggreprot.css';
import { makeChart, makeChartData, SelectedResidue, makeChartConfig } from '@datachart/2D';
import StructureViewer from './StructureViewer';
import { StructureConfig } from './StructureViewer';
import { LoadProteinParams } from '@loschmidt/molstar';
import '@loschmidt/molstar/dist/index.css';

interface IProps {
  mapSelectedResidues(input: SelectedResidue, direction?: number): SelectedResidue,
  profileData: makeChartData,
  profileConfig: makeChartConfig,
  structureData: LoadProteinParams[],
  structureConfig: StructureConfig
}

interface IState {
  chartFunctions: ReturnType<typeof makeChart> | null,
  selectedFromProfile: Record<string | number, boolean>, 
  selectedFromStructure: Record<string | number, boolean>,
}

class Aggreprot extends React.Component<IProps, IState> {

  structureViewerComponent = React.createRef<StructureViewer>();
  profileViewerComponent = React.createRef<ProfileViewer>();

  state: IState = {
    chartFunctions: null,
    selectedFromProfile: {},
    selectedFromStructure: {},
  }

  componentDidMount(): void {
    // override the onResidueSelectedFromProfile method
    this.props.profileConfig.onResidueSelectedFromProfile = (positions: SelectedResidue[]) => {
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
    if (this.structureViewerComponent.current) {
      let mappedPosition = this.props.mapSelectedResidues({index: position, selected: selected, protein: label,chain: chain});
      
      if (selected) {
        this.structureViewerComponent.current.selectPosition(
          mappedPosition.protein, // label
          {
            chain: (mappedPosition.chain == null) ? "A" : mappedPosition.chain,
            position: mappedPosition.index,
            color: this.props.structureConfig.selectColor,
            focus: true,
          }
        )
      } else {
        this.structureViewerComponent.current.deselectPosition(mappedPosition.protein, mappedPosition.index, (mappedPosition.chain == null) ? "A" : mappedPosition.chain);
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
    if (this.structureViewerComponent.current) {
      if (selected) {
        this.structureViewerComponent.current.selectPosition(
          mappedPosition.protein,
          {
            chain: (mappedPosition.chain == null)? "A": mappedPosition.chain,
            position: mappedPosition.index,
            color: this.props.structureConfig.selectColor,
            focus: false,
          }
        )
      } else {
        this.structureViewerComponent.current.deselectPosition(mappedPosition.protein, mappedPosition.index, (mappedPosition.chain == null)? "A": mappedPosition.chain);
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
        config={this.props.profileConfig}
        data={this.props.profileData}
        chartFunctions={this.state.chartFunctions}
        setChartFunctions={chartFunctions => this.setState({ chartFunctions })}
        onResidueSelectedFromProfile={this.onResidueSelectedFromProfile}
        ref={this.profileViewerComponent}
      />
      <StructureViewer
        onResidueClickedInStructure={this.onResidueClickedInStructure}
        structureData={this.props.structureData}
        structureConfig={this.props.structureConfig}
        ref={this.structureViewerComponent}
      />
    </>;
  } 
}

export default Aggreprot;
