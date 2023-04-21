import React from 'react';
import ReactDOM from 'react-dom';
import { Aggreprot } from './components';
import './index.css';
import '@loschmidt/molstar/dist/index.css';
import { SelectedResidue, fetchData, makeChartConfig } from "./components/ProfileViewer";
import { StructureConfig } from './components/StructureViewer';


// name of the file that will be fetched
let sourceFile = process.env.PUBLIC_URL + './DummyData.json';

// config of the profile viewer
// see https://github.com/elliahu/protein_visualization/blob/master/datachart.js#L148
const profileConfig: makeChartConfig = {
  debug: true,
}

// config of structure viewer
const structureConfig: StructureConfig = {
  viewerOptions: {
    layoutIsExpanded: false,
    layoutShowControls: true,
    layoutShowRemoteState: false,
    layoutShowSequence: true,
    layoutShowLog: false,
    layoutShowLeftPanel: false,
    layoutShowStructure: false,
  
    viewportShowExpand: true,
    viewportShowControls: true,
    viewportShowSettings: true,
    viewportShowSelectionMode: true,
    viewportShowAnimation: true,
  },
  backgroundColor: 0xffffff,
  selectColor: 0x0000ff
}

fetchData(sourceFile).then(data => {
  ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={input => {
          let output: SelectedResidue = input;
          if(input.protein == 'AmphiLuc4B') 
            output.chain = 'B';
          return output;
        }}
        profileData={data}
        profileConfig={profileConfig}
        structureData={[ 
          {
            url: process.env.PUBLIC_URL + '/AmphiLuc4B.pdb',
            format: 'pdb',
            label: 'AmphiLuc4B',
          },
          {
            url: process.env.PUBLIC_URL + '/AmphiLuc8.B99990005.pdb',
            format: 'pdb',
            label: 'AmphiLuc8-B99990005',
          }
        ]}
        structureConfig={structureConfig}
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
});

// Using raw data:
/*
const data: makeChartData = {
  dataframes:
    [
      // Protein 1
      {
        proteinID: 'cdk4',
        indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
        labels: ['A', 'B', null, 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // labels (sequence)
        agg: Array.from({ length: 10 }, () => Math.random()), // AGG
        asa: Array.from({ length: 10 }, () => Math.random()), // ASA
      },
      // Protein 2 
      {
        proteinID: '8fe1',
        indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // x indexes
        labels: ['A', 'B', null, 'D', 'E', 'F', 'G', 'H', 'I', 'J'], // labels (sequence)
        agg: Array.from({ length: 10 }, () => Math.random()), // AGG
        asa: Array.from({ length: 10 }, () => Math.random()), // ASA
      }
    ]
};
*/


