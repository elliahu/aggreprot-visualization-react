import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@loschmidt/molstar/dist/index.css';
import Aggreprot from './Aggreprot';

ReactDOM.render(
  <React.StrictMode>
    <Aggreprot />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
