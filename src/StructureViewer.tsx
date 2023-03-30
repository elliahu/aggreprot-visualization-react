import React, { Component } from 'react';
import {
  LigandSelector,
  LoadLigandsParams,
  LoadProteinParams,
  ProteinRepresentationType,
  ProteinSelector,
  resetCamera,
  removeAll,
  renderProtein,
  SelectPositionProps,
  PointSelector,
  ViewerOptionsType,
  getResidueIndex,
  MolstarWrapper,
  CavitySelector,
  CavityType,
} from '@loschmidt/molstar';
import { InteractivityManager } from 'molstar/lib/mol-plugin-state/manager/interactivity';
import { getProteinSelector } from '@loschmidt/molstar/dist/app/structures';
import { Loci } from 'molstar/lib/mol-model/loci';

/**
 * The properties of the cavity.
 */
type CavityProps = {
  /** The index of the cavity. */
  index: number;
  /** The path to the cavity. */
  url: string;
  /** The cavity type. */
  cavityType: CavityType;
  /** The color of the cavity. */
  color: string;
  selector?: CavitySelector;
};

/**
 * The properties of the ligand extends [[`LoadLigandsParams`]].
 */
type LigandProps = LoadLigandsParams & {
  selector?: LigandSelector;
};

/** The properties of the protein extends [[`LoadProteinParams`]]. */
type ProteinProps = LoadProteinParams & {
  selector: ProteinSelector;
  /** The list of ligands assigned to the protein. */
  ligands: LigandProps[];
  /** The list of tunnels assigned to the protein. */
  tunnels: CavityProps[];
  /** The list of pockets assigned to the protein. */
  pockets: CavityProps[];
};

/** The properties of the point. */
type PointProps = {
  index: number;
  selector: PointSelector;
};

const ViewerOptions: ViewerOptionsType = {
  layoutIsExpanded: false,
  layoutShowControls: true,
  layoutShowRemoteState: false,
  layoutShowSequence: true,
  layoutShowLog: false,
  layoutShowLeftPanel: false,
  layoutShowStructure: false,

  viewportShowExpand: false,
  viewportShowControls: false,
  viewportShowSettings: false,
  viewportShowSelectionMode: false,
  viewportShowAnimation: true,
};

interface IState {
  residueIndex: number;
  chain: string;
  residue: string;
  proteins: ProteinProps[];
  points: PointProps[];
}

interface IProps {
  onResidueClickedInStructure: (position: number, label: string, chain: string) => void;
}

class StructureViewer extends Component<IProps, IState> {
  viewer: any;

  constructor(props: any) {
    super(props);
  }

  state: IState = {
    residueIndex: -1,
    chain: '',
    residue: '',
    proteins: [],
    points: [],
  };

  componentDidMount() {
    this.initViewer();
  }

  async initViewer() {
    this.viewer = await MolstarWrapper.init('viewer', ViewerOptions);
    this.viewer.setBackground(0xffffff);

    // subscribe to a click event in the structure viewer
    this.viewer.plugin.behaviors.interaction.click.subscribe(
      (event: InteractivityManager.ClickEvent) => {
        const residueIndex = getResidueIndex(event);
        if (residueIndex) {
          console.log('MolstarViewer: selected residue', residueIndex);
          this.setState({
            residueIndex: residueIndex.residueIndex,
            chain: residueIndex.chain,
            residue: residueIndex.residue,
          });
          
          const loci: Loci = event.current.loci;
          if (Loci.isEmpty(loci) || loci.kind !== 'element-loci') return;
          if (loci.elements.length === 0) return;

          const element = loci.elements[0];
          const label = element.unit.model.label;
          
          this.props.onResidueClickedInStructure(residueIndex.residueIndex,label, residueIndex.chain);
        }
      }
    );

    this.loadProtein({
      url: process.env.PUBLIC_URL + '/cdk4.pdb',
      format: 'pdb',
      label: 'cdk4',
    });

    this.loadProtein({
      url: process.env.PUBLIC_URL + '/8fe1.pdb',
      format: 'pdb',
      label: '8fe1',
    });
  }

  /**
   * Check if the file exists
   * @param url - The path to file
   */
  async exists(url: string) {
    const result = await fetch(url, { method: 'HEAD' });
    return result.ok;
  }

  /**
   * Load protein
   * @param props - [[`LoadProteinParams`]]
   */
  async loadProtein(props: LoadProteinParams) {
    const proteinState = this.state.proteins.find(s => s.label === props.label);
    if (proteinState && proteinState.selector) {
      proteinState.selector.show();
    } else {
      const proteinSelector = await renderProtein(this.viewer.plugin, {
        url: props.url,
        format: props.format,
        label: props.label,
        color: props.color,
      });

      if (proteinSelector)
        this.setState({
          proteins: [
            ...this.state.proteins,
            {
              ...props,
              selector: proteinSelector,
              ligands: [],
              tunnels: [],
              pockets: [],
            },
          ],
        });
    }
  }

  /**
   * Hide protein
   * @param proteinState
   */
  hideProtein(proteinState: ProteinProps) {
    console.log(this.viewer.plugin.customState);
    proteinState.selector?.hide();
  }

  /**
   * Highlight position in the structure
   * @param proteinLabel
   * @param params
   */
  async selectPosition(proteinLabel: string, params: SelectPositionProps) {
    const proteinState = this.state.proteins.find(
      p => p.label === proteinLabel
    );
    if (proteinState && proteinState.selector) {
      proteinState.selector.selectPosition(params);
    }
  }

  /**
   * Deselect position in the structure.
   * @param proteinLabel
   * @param position
   * @param chain
   * @param tag
   */
  async deselectPosition(
    proteinLabel: string,
    position: number | number[],
    chain: string,
    tag?: string
  ) {
    const proteinState = this.state.proteins.find(
      p => p.label === proteinLabel
    );
    if (proteinState && proteinState.selector) {
      proteinState.selector.deselectPosition(position, chain, tag);
    }
  }

  /**
   * Focus position in the structure.
   * @param proteinLabel
   * @param position
   * @param chain
   */
  async focusPosition(
    proteinLabel: string,
    position: number | number[],
    chain: string
  ) {
    const proteinState = this.state.proteins.find(
      p => p.label === proteinLabel
    );
    if (proteinState && proteinState.selector) {
      proteinState.selector.focusPosition(position, chain);
    }
  }

  /**
   * Update protein representation. Possible options are cartoon, ball-and-stick and molecular-surface.
   * @param proteinState
   * @param repr
   */
  updateProteinRepresentation(
    proteinState: ProteinProps,
    repr: ProteinRepresentationType
  ) {
    proteinState.selector?.updateRepresentation(repr, proteinState.color);
  }

  /**
   * Reset camera.
   */
  async resetCamera() {
    await resetCamera(this.viewer.plugin);
  }

  /**
   * Remove all elements from the viewer.
   */
  async clearAll() {
    await removeAll(this.viewer.plugin);
  }

  render() {
    return (
      <div>
        <div className={'molstar-viewer'}>
          <div className={'plugin-container'}>
            <div id={'viewer'} />
            <div id={'controls'} />
          </div>
        </div>
      </div>
    );
  }
}

export default StructureViewer;
