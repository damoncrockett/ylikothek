import React, { Component, useState, useEffect, useRef, createRef } from 'react';
import { data } from './data';

const cols = ['INSTITUTION', 'CATALOG NO.', 'FULL BARCODE', 'COMMON NAME',
              'SAMPLE TYPE', 'ACQUISITION DATE', 'GEOGRAPHIC ORIGIN',
              'MANUFACTURER', 'AVAILABLE DATA', 'COLOR'];

function TableCells({ sortCol, asc, filterList }) {

  let processedData = [...data];

  filterList.forEach((item, i) => {
    if ( item !== '' ) {
      processedData = processedData.filter(d => d[i].toLowerCase().includes(item.toLowerCase()))
    }
  });

  if ( asc === true ) {
    processedData = processedData.sort((a,b) => a[cols.indexOf(sortCol)].localeCompare(b[cols.indexOf(sortCol)]));
  } else if ( asc === false ) {
    processedData = processedData.sort((a,b) => b[cols.indexOf(sortCol)].localeCompare(a[cols.indexOf(sortCol)]));
  }

  return (
    <tbody id='tbody'>
      {processedData.map(d => <tr className='datarow'>{d.map(i => <td>{i}</td>)}</tr>)}
    </tbody>
  )
}

export default function App() {

  const [sortCol, setSortCol] = useState('INSTITUTION');
  const [asc, setAsc] = useState(true);
  const [searchTerms, setSearchTerms] = useState(['','','','','','','','','','']);
  const fieldsRef = useRef(cols.map(() => createRef()));

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
              {cols.map((c,i) => <th className="searchField"><form onSubmit={e => {e.preventDefault();const tmp=[...searchTerms];tmp[i]=fieldsRef.current[i].current.value;setSearchTerms(tmp)}}><input ref={fieldsRef.current[i]} type="text" className="searchField" /></form></th>)}
            </tr>
            <tr>
              {cols.map(c => <th><button className={sortCol === c && asc === true ? 'material-icons active' : 'material-icons'} onClick={() => {setSortCol(c);setAsc(true)}} >arrow_upward</button><button title='sort' className={sortCol === c && asc === false ? 'material-icons active' : 'material-icons'} onClick={() => {setSortCol(c);setAsc(false)}} >arrow_downward</button></th>)}
            </tr>
            <tr>
              {cols.map(c => <th className='colLabel'>{c}</th>)}
            </tr>
          </thead>
          <TableCells sortCol={sortCol} asc={asc} filterList={searchTerms}/>
        </table>
      </div>
    </div>
  )
}
