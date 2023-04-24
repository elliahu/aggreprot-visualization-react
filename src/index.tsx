import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { fetchData } from '@datachart/2D';

let sourceFile = process.env.PUBLIC_URL + './DummyData.json';
fetchData(sourceFile).then(data => {
  ReactDOM.render(
    <React.StrictMode>
      <App data2D={data} data3D={[
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
      ]}></App>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );
});




