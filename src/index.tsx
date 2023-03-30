import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@loschmidt/molstar/dist/index.css';
import Aggreprot from './Aggreprot';
import { type SelectedResidue, fetchData, type makeChartData } from "protein_visualization";


// name of the file that will be fetched
let sourceFile = process.env.PUBLIC_URL + './datachart_data/DummyData.json';

fetchData(sourceFile, 'json').then(data => {
  ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={(input: SelectedResidue) => { return input }}
        chartData={data}
        loadProteins={[
          {
            url: process.env.PUBLIC_URL + '/cdk4.pdb',
            format: 'pdb',
            label: 'cdk4',
          },
          {
            url: process.env.PUBLIC_URL + '/8fe1.pdb',
            format: 'pdb',
            label: '8fe1',
          }
        ]}
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
})

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
ReactDOM.render(
    <React.StrictMode>
      <Aggreprot
        mapSelectedResidues={(input: SelectedResidue) => { return input }}
        chartData={data}
        loadProteins={[
          {
            url: process.env.PUBLIC_URL + '/cdk4.pdb',
            format: 'pdb',
            label: 'cdk4',
          },
          {
            url: process.env.PUBLIC_URL + '/8fe1.pdb',
            format: 'pdb',
            label: '8fe1',
          }
        ]}
      />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
*/


