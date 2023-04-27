import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { fetchData } from '@matejelias/datachart';

let sourceFile = process.env.PUBLIC_URL + './HLDsData.json';
fetchData(sourceFile).then(data => {
  ReactDOM.render(
    <React.StrictMode>
      <App data2D={data} data3D={[
        {
          url: process.env.PUBLIC_URL + '/1mj5.pdb',
          format: 'pdb',
          label: 'LinB',
        },
        {
          url: process.env.PUBLIC_URL + '/2psfB.pdb',
          format: 'pdb',
          label: 'Rluc',
        }
      ]}></App>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
});




