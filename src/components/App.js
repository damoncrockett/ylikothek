import React, { useState, useEffect } from 'react';
import { data } from './data';

const cols = ['INSTITUTION', 'CATALOG NO.', 'FULL BARCODE', 'COMMON NAME',
              'SAMPLE TYPE', 'ACQUISITION DATE', 'GEOGRAPHIC ORIGIN',
              'MANUFACTURER', 'AVAILABLE DATA', 'COLOR'];

export default function App() {

  return (
    <div id='app'>
      <div id='banner'>
        <span id='title'>ylikothek</span>
        <span id='subtitle'>MATERIALS DATABASE</span>
      </div>
      <div id='viewpane'>
        <table id='tabular'>
          <thead id='thead'>
            <tr>
              {cols.map(c => <th>{c}</th>)}
            </tr>
          </thead>
          <tbody id='tbody'>
            {data.map(d => <tr>{d.map(i => <td>{i}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
