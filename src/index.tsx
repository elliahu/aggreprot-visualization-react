import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@loschmidt/molstar/dist/index.css';
import Aggreprot from './Aggreprot';
import {type SelectedResidue} from "protein_visualization";

ReactDOM.render(
  <React.StrictMode>
    <Aggreprot mapSelectedResidues={(input: SelectedResidue) => {return input}}/>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
