import React, { Component, useState, useEffect, useRef, createRef } from 'react';
import { data } from './data';

const cols = ['INSTITUTION', 'CATALOG NO.', 'FULL BARCODE', 'COMMON NAME',
              'SAMPLE TYPE', 'ACQUISITION DATE', 'GEOGRAPHIC ORIGIN',
              'MANUFACTURER', 'AVAILABLE DATA', 'COLOR'];

const valueCounts = (arr) => arr.reduce((ac,a) => (ac[a] = ac[a] + 1 || 1,ac), {});

function CountModal({ countCol, filterList }) {

  const [azSort,setAzSort] = useState(false);

  let processedData = [...data];

  filterList.forEach((item, i) => {
    if ( item !== '' ) {
      processedData = processedData.filter(d => d[i].toLowerCase().includes(item.toLowerCase()))
    }
  });

  const countObject = valueCounts(processedData.map(d => d[countCol]));
  let countArrays = [];

  Object.keys(countObject).forEach((item, i) => {
    const pair = [item, countObject[item]];
    countArrays.push(pair);
  });

  countArrays = countArrays.sort((a,b) => b[1]-a[1] );

  const cell = document.getElementById("c"+countCol);
  const compStyle = window.getComputedStyle(cell);
  const width = compStyle.getPropertyValue('width');
  const left = cell.getBoundingClientRect().left;
  const bottom = cell.getBoundingClientRect().bottom;
  const height = window.innerHeight - bottom - window.innerHeight * 0.04;

  return (
    <div id='countModal' style={{width: width, height: height, top: bottom, left: left}}>
      <div className='countsHeading'>
        <span>COUNTS</span>
        <button id='azSort' className={azSort ? 'material-icons active' : 'material-icons'} onClick={() => setAzSort(!azSort)} >sort_by_alpha</button>
      </div>
      {azSort && Object.keys(countObject).sort().map((d,i) => <p key={i}>{"["+countObject[d]+"]  "+d}</p>)}
      {!azSort && countArrays.map((d,i) => <p key={i}>{"["+d[1]+"]  "+d[0]}</p>)}
    </div>
  )
}

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
      {processedData.map((d,idx) => <tr key={idx} className='datarow'>{d.map((i,j) => <td key={j}>{i}</td>)}</tr>)}
    </tbody>
  )
}

export default function App() {

  const [sortCol, setSortCol] = useState('INSTITUTION');
  const [asc, setAsc] = useState(true);
  const [searchTerms, setSearchTerms] = useState(new Array(cols.length).fill(''));
  const fieldsRef = useRef(cols.map(() => createRef()));
  const [countModal, setCountModal] = useState(false);
  const [countCol, setCountCol] = useState('');

  return (
    <div id='app'>
      <div id='scrollers'>
        <button id='top' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,0)}>vertical_align_top</button>
        <button id='uup' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop - document.getElementById("tabular").getBoundingClientRect().height / 10)}>keyboard_double_arrow_up</button>
        <button id='up' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop - document.getElementById("tabular").getBoundingClientRect().height / 20)}>keyboard_arrow_up</button>
        <button id='down' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop + document.getElementById("tabular").getBoundingClientRect().height / 20)}>keyboard_arrow_down</button>
        <button id='ddown' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop + document.getElementById("tabular").getBoundingClientRect().height / 10)}>keyboard_double_arrow_down</button>
        <button id='bottom' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("tabular").getBoundingClientRect().height)}>vertical_align_bottom</button>
      </div>
      <div id='banner'>
        <span id='title'>ylikothek</span>
        <span id='subtitle'>MATERIALS DATABASE</span>
      </div>
      <div id='viewpane'>
        <table id='tabular'>
          <thead id='thead'>
            <tr>
              {cols.map((c,i) => <th key={i} className="searchField"><form onSubmit={e => {e.preventDefault();const tmp=[...searchTerms];tmp[i]=fieldsRef.current[i].current.value;setSearchTerms(tmp)}}><input ref={fieldsRef.current[i]} type="text" className="searchField" /></form></th>)}
            </tr>
            <tr>
              {cols.map((c,i) => <th key={i}><button className={sortCol === c && asc === true ? 'material-icons active' : 'material-icons'} onClick={() => {setSortCol(c);setAsc(true);document.getElementById("viewpane").scrollTo(0,0)}} >arrow_upward</button><button title='sort' className={sortCol === c && asc === false ? 'material-icons active' : 'material-icons'} onClick={() => {setSortCol(c);setAsc(false);document.getElementById("viewpane").scrollTo(0,0)}} >arrow_downward</button></th>)}
            </tr>
            <tr>
              {cols.map((c,i) => <th key={i} id={'c'+i} className='colLabel'><button id={'b'+i} onClick={() => {setCountModal(countCol===i ? false : true);setCountCol(countCol===i ? '' : i)}}>{c}</button></th>)}
            </tr>
          </thead>
          <TableCells sortCol={sortCol} asc={asc} filterList={searchTerms}/>
        </table>
      </div>
      {countModal && <CountModal countCol={countCol} filterList={searchTerms} />}
    </div>
  )
}
