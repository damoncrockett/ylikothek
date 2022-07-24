import React, { Component, useState, useEffect, useRef, createRef } from 'react';
import { data } from './data';
import { dataraw } from './dataraw';

const cols = ['INSTITUTION', 'CATALOG NO.', 'FULL BARCODE', 'COMMON NAME',
              'SAMPLE TYPE', 'ACQUISITION DATE', 'GEOGRAPHIC ORIGIN',
              'MANUFACTURER', 'AVAILABLE DATA', 'COLOR'];

const rawcols = ['Common Name','Additional Names','Sample Type','Typical Use',
 'Chemical Formula','Chemical Name','Chemical (CAS) No.','Compound Type',
 'Mixture Type','Physical Form','Color','Color Index (CI) No.','Natural/Synthetic',
 'Preparation','Certified Standard?','Barcode Prefix','Barcode No.','Full Barcode', //17
 'Grid Location','MSDS Sheet?','Acquisition Date','Geographic Origin','Part of a Collection?',
 'Collection Name','Acquired By','Acquired From','Contact Name','Phone No.','E-Mail',
 'Manufacturer','Catalog No.','Origination Date','Available Data','Mass or Volume',
 'Experiments','Notes','MSDS - Reporting','Fire Safety','Reactivity Safety','Health Safety',
 'Other Safety','Warning Field','In Stock?','In Stock? - Reporting','Inventory Tracking barcode',
 'Inventory Tracking checkin','Inventory Tracking checkout','Checked Out By','Check Out Date',
 'Old Barcode','Component1','Component2','Component3','Mixture Pigment','Formulation',
 'Component 1 dummy field','Component 2 dummy field','Component 3 dummy field',
 'Mixture Pigment dummy field','Formulation dummy field','Analysis Date','Insturment',
 'Analysis Lab','Sample Prep','Scan Parameters','Chem Composition Confirmed','testbarcode'];

const valueCounts = (arr) => arr.reduce((ac,a) => (ac[a] = ac[a] + 1 || 1,ac), {});

function anybool(iterable) {
    for (var index = 0; index < iterable.length; index++) {
        if (iterable[index]) return true;
    }
    return false;
}

function allbool(iterable) {
    for (var index = 0; index < iterable.length; index++) {
        if (!iterable[index]) return false;
    }
    return true;
}

function CountModal({ countModal, countCol, filterList }) {

  const [azSort,setAzSort] = useState(false);
  let processedData = [...data];

  filterList.forEach((item, i) => {
    if ( item !== '' ) {
      if ( item.includes('&') ) {
        const items = item.split('&');
        processedData = processedData.filter(d => allbool(items.map(s => d[i].toLowerCase().includes(s.toLowerCase()))) )
      } else if ( item.includes('|') ) {
        const items = item.split('|');
        processedData = processedData.filter(d => anybool(items.map(s => d[i].toLowerCase().includes(s.toLowerCase()))) )
      } else {
        processedData = processedData.filter(d => d[i].toLowerCase().includes(item.toLowerCase()))
      }
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
  const height = window.innerHeight - bottom - window.innerHeight * 0.02;

  useEffect(() => {
    if ( countModal ) {
      document.getElementById("countModal").scrollTo(0,0);
    }
  },[countCol])

  return (
    <div id='countModal' style={{width: width, height: height, top: bottom, left: left}}>
      <div className='countsHeading'>
        <span>COUNTS</span>
        <button id='azSort' className={azSort ? 'material-icons active' : 'material-icons'} onClick={() =>{setAzSort(!azSort);document.getElementById("countModal").scrollTo(0,0)}} >sort_by_alpha</button>
      </div>
      {azSort && Object.keys(countObject).sort().map((d,i) => <p key={i}>{<FormatCountModal ct={countObject[d]} val={d} />}</p>)}
      {!azSort && countArrays.map((d,i) => <p key={i}>{<FormatCountModal ct={d[1]} val={d[0]} />}</p>)}
    </div>
  )
}

function FormatCountModal({ ct, val }) {
  return (
    <div>
      <span className='countModalCt'>{ct}</span>
      <span className={val==='' ? 'countModalNull' : 'countModalVal'}>{val==='' ? '[null]' : val}</span>
    </div>
  )
}

function TableCells({ sortCol, asc, filterList, setRawModal, setRawRow }) {

  let processedData = [...data];

  filterList.forEach((item, i) => {
    if ( item !== '' ) {
      if ( item.includes('&') ) {
        const items = item.split('&');
        processedData = processedData.filter(d => allbool(items.map(s => d[i].toLowerCase().includes(s.toLowerCase()))) )
      } else if ( item.includes('|') ) {
        const items = item.split('|');
        processedData = processedData.filter(d => anybool(items.map(s => d[i].toLowerCase().includes(s.toLowerCase()))) )
      } else {
        processedData = processedData.filter(d => d[i].toLowerCase().includes(item.toLowerCase()))
      }
    }
  });

  if ( asc === true ) {
    processedData = processedData.sort((a,b) => a[cols.indexOf(sortCol)].localeCompare(b[cols.indexOf(sortCol)]));
  } else if ( asc === false ) {
    processedData = processedData.sort((a,b) => b[cols.indexOf(sortCol)].localeCompare(a[cols.indexOf(sortCol)]));
  }

  return (
    <tbody id='tbody'>
      {processedData.map((d,idx) => <tr key={idx} className='datarow' onClick={()=>{setRawModal(true);setRawRow(dataraw.filter(r => r[17]===d[2])[0])}} >{d.map((i,j) => <td key={j}>{i}</td>)}</tr>)}
    </tbody>
  )
}

const FormatRaw = ({ cat, val }) => {
  return (
    <div>
      <span className={val==='' ? 'rawCatGhost' : 'rawCat'}>{cat}</span>
      <span className='rawVal'>{val}</span>
    </div>
  )
}

function RawModal({ rawRow, setRawModal }) {
  return (
    <div id='rawModal'>
      <button id='rawModalClose' className='material-icons' onClick={()=>setRawModal(false)}>close</button>
      {rawRow.map((r,i) => <p key={i}>{<FormatRaw cat={rawcols[i]} val={r} />}</p>)}
    </div>
  )
}

export default function App() {

  const [sortCol, setSortCol] = useState('INSTITUTION');
  const [asc, setAsc] = useState(true);
  const [searchTerms, setSearchTerms] = useState(new Array(cols.length).fill(''));
  const fieldsRef = useRef(cols.map(() => createRef()));
  const [countModal, setCountModal] = useState(false);
  const [countCol, setCountCol] = useState('');
  const [rawModal,setRawModal] = useState(false);
  const [rawRow,setRawRow] = useState(new Array(rawcols.length).fill(''));

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
          <TableCells sortCol={sortCol} asc={asc} filterList={searchTerms} setRawModal={setRawModal} setRawRow={setRawRow}/>
        </table>
      </div>
      {countModal && <CountModal countModal={countModal} countCol={countCol} filterList={searchTerms} />}
      {rawModal && <RawModal rawRow={rawRow} setRawModal={setRawModal} />}
    </div>
  )
}
