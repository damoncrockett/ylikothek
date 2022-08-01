import React, { Component, useState, useEffect, useRef, createRef } from 'react';
import { data } from './data';
import { dataraw } from './raw';

const cols = ['INSTITUTION','INDEX','NAME','TYPE','YEAR','ORIGIN','MANUFACTURER','COLOR','ANALYSIS'];

const gettycols = ['Common Name','Additional Names','Sample Type','Typical Use',
 'Chemical Formula','Chemical Name','Chemical (CAS) No.','Compound Type',
 'Mixture Type','Physical Form','Color','Color Index (CI) No.','Natural/Synthetic',
 'Preparation','Certified Standard?','Barcode Prefix','Barcode No.','Full Barcode',
 'Grid Location','MSDS Sheet?','Acquisition Date','Geographic Origin','Part of a Collection?',
 'Collection Name','Acquired By','Acquired From','Contact Name','Phone No.','E-Mail',
 'Manufacturer','Catalog No.','Origination Date','Available Data','Mass or Volume',
 'Experiments','Notes','MSDS - Reporting','Fire Safety','Reactivity Safety','Health Safety',
 'Other Safety','Warning Field','In Stock?','In Stock? - Reporting','Inventory Tracking barcode',
 'Inventory Tracking checkin','Inventory Tracking checkout','Checked Out By','Check Out Date',
 'Old Barcode','Component1','Component2','Component3','Mixture Pigment','Formulation',
 'Component 1 dummy field','Component 2 dummy field','Component 3 dummy field',
 'Mixture Pigment dummy field','Formulation dummy field','Analysis Date','Insturment',
 'Analysis Lab','Sample Prep','Scan Parameters','Chem Composition Confirmed','testbarcode',
 'Institution']; //68

const ngacols = ['Number', 'Analysis Results', 'Approximate Manufacture Date',
       'Box Number', 'Chemical Formula', 'CI Name', 'CI Number',
       'Classification', 'Color', 'Container', 'Crimp Number', 'Duplicate of',
       'Group Characteristics', 'Group Number', 'Hue', 'Item with No Label',
       'Label Text', 'Lightfastness', 'Lit Sample Code', 'Location Status',
       'Manufacturer', 'Manufacturer Address', 'Manufacturer Code',
       'Manufacturer ID', 'Media Reported', 'Missing Item', 'ml Calculation',
       'ml Entry', 'Number in Group', 'Number in Set', 'Number of Duplicates',
       'Other Size Information', 'oz Calculation', 'oz Entry', 'Parent Item',
       'Pigment Property', 'Pigment Reported by Manufacturer',
       'Pigment Scientific Name', 'Price Tag Information', 'Product',
       'Retail Price', 'Sample Notes', 'See Also', 'Set Characteristics',
       'Set Number', 'Vintage Category', '::Literature Available',
       '::Manufacturer', '::_PK_Classification Number', 'Institution'];  //50

const ngarawcols = ['Box Number', 'Chemical Formula', 'Cl Name', 'Cl Number',
       'Classification', 'Classification Number', 'Color', 'Container',
       'Distinguishing Characteristics', 'Group Number', 'Hue', 'Item Number',
       'Label Text', 'Manufacture Date', 'Manufacturer',
       'Manufacturer Address', 'Manufacturer ID', 'Media Reported',
       'ml Calculation', 'ml Entry', 'Notes', 'Number in Group',
       'Other Size Information', 'ox Calculation', 'oz Entry',
       'Pigment Reported', 'Place of Origin', 'Price Tag Information',
       'Product', 'Institution']; //30

const yalecols = ['PhotoID','Year','Catalog Number','Secondary Catalog Number',
 'Number of sheets (apx)','DateUncertain','Manufacturer','Brand','PhotoPapers_Notes',
 'Sampled','Scanned','FluorescenceVerso','FluorescenceRecto','FLuorescence Notes',
 'OBAVersoIndeterminant','OBACheck','OBARectoIndeterminant','OmitFromOBASurvey',
 'Copy','Copies','FiberSampleSent','FiberSample','T1','T2','T3','T4','T5','Mounted?',
 'Emulsion_thickness','FiberSampleSendDate','GCI_analysis','D','W1','W2','W3',
 "Walter'sBook",'FiberResutls','OmitFromLogoWebsite?','WhyOmittedFromLogoWebsite',
 'BackprintingWebsite','MoMATextureStudy','new_surface_image_needed?','surface_image',
 'Yale_inventory?','Thickness?','Gloss?','Texture?','Color?','Missing sample Oct 2019',
 'LocationBox','LocationBag','LocationNotes','gloss','processing_instructions',
 'IntroductionDate','EndDate','Export_csvQRY_Brand_Notes','Expr1057','Expr1058',
 'BaseColor2','BaseColor2Definition','L*-recto','a*-recto','b*-recto','R-recto',
 'G-recto','B-recto','L*-verso','a*-verso','b*-verso','R-verso','G-verso',
 'B-verso','PaperGrade2','PaperGrade2Definition','PaperGrade2Code','ContrastGrade_Notes',
 'Amount','FiberResults_Notes','SpeciesNotes','SpeciesID','FiberType','Species',
 'Export_csvQRY_Species_Notes','Finish','Export_csvQRY_Finish_Notes','Format',
 'Export_csvQRY_Format_Notes','ComapnyStartDate','CompanyEndDate','CompanyAddress',
 'MergeHistory','Bibliography','Export_csvQRY_Manufacturer_Notes','Month','Purpose2',
 'Purpose2Definition','Reflectance2','Reflectance2Definition','Texture2','Texture2Definition',
 'Weight2','Weight2Definition','Size','Export_csvQRY_Size_Notes','SurfaceDesignation2Definition',
 'SurfaceDesignation2','SurfaceDesignation2Term','Institution'];


const valueCounts = (arr) => arr.reduce((ac,a) => (ac[a] = ac[a] + 1 || 1, ac ), {});

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

function CountModal({ processedData, countModal, countCol }) {

  const [azSort,setAzSort] = useState(false);

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
      {azSort && Object.keys(countObject).sort().map((d,i) => <div className='countCell' key={i}>{<FormatCountModal ct={countObject[d]} val={d} />}</div>)}
      {!azSort && countArrays.map((d,i) => <div className='countCell' key={i}>{<FormatCountModal ct={d[1]} val={d[0]} />}</div>)}
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

function TableCells({ processedData, setRawModal, setRawRow, setRawCols, tablePage, clickedId, setClickedId }) {

  return (
    <tbody id='tbody'>
      {tablePage===1 && processedData.slice(0,8451).map(d => <tr key={d[9]} className={clickedId === 'r'+d[9] ? 'datarow active' : 'datarow'} id={'r'+d[9]} onClick={()=>{setClickedId('r'+d[9]);setRawModal(true);setRawRow(dataraw[d[9]]);setRawCols(dataraw[d[9]].length===68 ? gettycols : dataraw[d[9]].length===50 ? ngacols : dataraw[d[9]].length===30 ? ngarawcols : yalecols);}} >{d.slice(0,9).map((i,j) => <td key={j}>{i}</td>)}</tr>)}
      {tablePage===2 && processedData.slice(8451,16902).map(d => <tr key={d[9]} className={clickedId === 'r'+d[9] ? 'datarow active' : 'datarow'} id={'r'+d[9]} onClick={()=>{setClickedId('r'+d[9]);setRawModal(true);setRawRow(dataraw[d[9]]);setRawCols(dataraw[d[9]].length===68 ? gettycols : dataraw[d[9]].length===50 ? ngacols : dataraw[d[9]].length===30 ? ngarawcols : yalecols);}} >{d.slice(0,9).map((i,j) => <td key={j}>{i}</td>)}</tr>)}
      {tablePage===3 && processedData.slice(16902,25353).map(d => <tr key={d[9]} className={clickedId === 'r'+d[9] ? 'datarow active' : 'datarow'} id={'r'+d[9]} onClick={()=>{setClickedId('r'+d[9]);setRawModal(true);setRawRow(dataraw[d[9]]);setRawCols(dataraw[d[9]].length===68 ? gettycols : dataraw[d[9]].length===50 ? ngacols : dataraw[d[9]].length===30 ? ngarawcols : yalecols);}} >{d.slice(0,9).map((i,j) => <td key={j}>{i}</td>)}</tr>)}
      {tablePage===4 && processedData.slice(25353,33804).map(d => <tr key={d[9]} className={clickedId === 'r'+d[9] ? 'datarow active' : 'datarow'} id={'r'+d[9]} onClick={()=>{setClickedId('r'+d[9]);setRawModal(true);setRawRow(dataraw[d[9]]);setRawCols(dataraw[d[9]].length===68 ? gettycols : dataraw[d[9]].length===50 ? ngacols : dataraw[d[9]].length===30 ? ngarawcols : yalecols);}} >{d.slice(0,9).map((i,j) => <td key={j}>{i}</td>)}</tr>)}
      {tablePage===5 && processedData.slice(33804,42255).map(d => <tr key={d[9]} className={clickedId === 'r'+d[9] ? 'datarow active' : 'datarow'} id={'r'+d[9]} onClick={()=>{setClickedId('r'+d[9]);setRawModal(true);setRawRow(dataraw[d[9]]);setRawCols(dataraw[d[9]].length===68 ? gettycols : dataraw[d[9]].length===50 ? ngacols : dataraw[d[9]].length===30 ? ngarawcols : yalecols);}} >{d.slice(0,9).map((i,j) => <td key={j}>{i}</td>)}</tr>)}
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

function RawModal({ rawRow, setRawModal, rawCols, clickedId, setClickedId }) {
  return (
    <div id='rawModal'>
      <button id='rawModalClose' className='material-icons rawButton' onClick={()=>{setRawModal(false);setClickedId(null)}}>close</button>
      <button id='rawModalSiblingAbove' className='material-icons rawButton' onClick={()=>{document.getElementById(document.getElementById(clickedId).previousSibling.id).click()}}>arrow_upward</button>
      <button id='rawModalSiblingBelow' className='material-icons rawButton' onClick={()=>{document.getElementById(document.getElementById(clickedId).nextSibling.id).click()}}>arrow_downward</button>
      {rawRow.map((r,i) => <div className='rawCell' key={i}>{<FormatRaw cat={rawCols[i]} val={r} />}</div>)}
    </div>
  )
}

export default function App() {

  const [sortCol, setSortCol] = useState('INSTITUTION');
  const [asc, setAsc] = useState(true);

  const [searchTerms, setSearchTerms] = useState(new Array(cols.length).fill(''));
  const [columnSearchIdxs,setColumnSearchIdxs] = useState([]);
  const [totalSearchIdxs,setTotalSearchIdxs] = useState([]);
  const [totalSearch, setTotalSearch] = useState('');
  const totalRef = useRef();
  const fieldsRef = useRef(cols.map(() => createRef()));

  const [countModal, setCountModal] = useState(false);
  const [countCol, setCountCol] = useState('');

  const [rawModal, setRawModal] = useState(false);
  const [rawRow, setRawRow] = useState(null);
  const [rawCols, setRawCols] = useState(null);

  const [clickedId,setClickedId] = useState(null);
  const [tablePage, setTablePage] = useState(1);

  useEffect(() => {
    const tmp = [];
    if ( totalSearch !== '' ) {
      dataraw.forEach((row, i) => {
        if ( totalSearch.includes('&') ) {
          const conjuncts = totalSearch.split('&');
          if ( !anybool(row.map(cell => allbool(conjuncts.map(c => cell.toLowerCase().includes(c.toLowerCase()))))) ) {
            tmp.push(i);
          }
        } else if ( totalSearch.includes('|') ) {
          const disjuncts = totalSearch.split('|');
          if ( !anybool(row.map(cell => anybool(disjuncts.map(d => cell.toLowerCase().includes(d.toLowerCase()))))) ) {
            tmp.push(i);
          }
        } else {
          if ( !anybool(row.map(cell => cell.toLowerCase().includes(totalSearch.toLowerCase()))) ) {
            tmp.push(i);
          }
        }
      });
    }
    setTotalSearchIdxs(tmp);
  },[totalSearch])

  useEffect(() => {
    const tmp = [];
    for ( const [i, item] of data.entries() ) {
      for ( const [k, j] of item.slice(0,9).entries() ) {
        const searchEntry = searchTerms[k];
        if ( searchEntry !== '' ) {
          if ( searchEntry.includes('&') ) {
            const conjuncts = searchEntry.split('&');
            if ( !allbool(conjuncts.map(c => j.toLowerCase().includes(c.toLowerCase()))) ) {
              tmp.push(i);
              break;
            }
          } else if ( searchEntry.includes('|') ) {
            const disjuncts = searchEntry.split('|');
            if ( !anybool(disjuncts.map(d => j.toLowerCase().includes(d.toLowerCase()))) ) {
              tmp.push(i);
              break;
            }
          } else {
            if ( !j.toLowerCase().includes(searchEntry.toLowerCase()) ) {
              tmp.push(i);
              break;
            }
          }
        }
      }
    }
    setColumnSearchIdxs(tmp);
  },[searchTerms])

  const idxsToRemove = new Set(columnSearchIdxs.concat(totalSearchIdxs));
  const dataRange = Array.from(Array(data.length).keys());
  const idxsToKeep = dataRange.filter(el => !idxsToRemove.has(el)); // this helped a lot!
  let processedData = idxsToKeep.map(i => data[i]);

  if ( asc === true ) {
    processedData = processedData.sort((a,b) => a[cols.indexOf(sortCol)].localeCompare(b[cols.indexOf(sortCol)]));
  } else if ( asc === false ) {
    processedData = processedData.sort((a,b) => b[cols.indexOf(sortCol)].localeCompare(a[cols.indexOf(sortCol)]));
  }

  return (
    <div id='app'>
      {clickedId !== null && <button id='clickIdButton' onClick={() => document.getElementById(clickedId).scrollIntoView({block: "center"})} >&mdash;</button>}
      <div id='scrollers'>
        <button id='top' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,0)}>vertical_align_top</button>
        <button id='uup' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop - document.getElementById("tabular").getBoundingClientRect().height / 10)}>keyboard_double_arrow_up</button>
        <button id='up' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop - document.getElementById("tabular").getBoundingClientRect().height / 20)}>keyboard_arrow_up</button>
        <button id='down' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop + document.getElementById("tabular").getBoundingClientRect().height / 20)}>keyboard_arrow_down</button>
        <button id='ddown' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("viewpane").scrollTop + document.getElementById("tabular").getBoundingClientRect().height / 10)}>keyboard_double_arrow_down</button>
        <button id='bottom' className='material-icons' onClick={() => document.getElementById("viewpane").scrollTo(0,document.getElementById("tabular").getBoundingClientRect().height)}>vertical_align_bottom</button>
      </div>
      <div id='banner'>
        <span id='title'>ioma</span>
        <form id="totalSearch" onSubmit={e => {e.preventDefault();setTotalSearch(totalRef.current.value)}}><input ref={totalRef} type="text" id='totalSearchField' /><input type="submit" value="SEARCH RAW FIELDS" id="totalSearchButton"/></form>
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
          <TableCells processedData={processedData} setRawModal={setRawModal} setRawRow={setRawRow} setRawCols={setRawCols} tablePage={tablePage} clickedId={clickedId} setClickedId={setClickedId} />
        </table>
      </div>
      <div id='pageButtons'>
        {processedData.length > 8451 && <button className={tablePage===1 ? 'pageButton active' : 'pageButton'} onClick={() => {setTablePage(1);document.getElementById("viewpane").scrollTo(0,0)}} >1</button>}
        {processedData.length > 8451 && <button className={tablePage===2 ? 'pageButton active' : 'pageButton'} onClick={() => {setTablePage(2);document.getElementById("viewpane").scrollTo(0,0)}} >2</button>}
        {processedData.length > 16902 && <button className={tablePage===3 ? 'pageButton active' : 'pageButton'} onClick={() => {setTablePage(3);document.getElementById("viewpane").scrollTo(0,0)}} >3</button>}
        {processedData.length > 25353 && <button className={tablePage===4 ? 'pageButton active' : 'pageButton'} onClick={() => {setTablePage(4);document.getElementById("viewpane").scrollTo(0,0)}} >4</button>}
        {processedData.length > 33804 && <button className={tablePage===5 ? 'pageButton active' : 'pageButton'} onClick={() => {setTablePage(5);document.getElementById("viewpane").scrollTo(0,0)}} >5</button>}
      </div>
      {countModal && <CountModal processedData={processedData} countModal={countModal} countCol={countCol} />}
      {rawModal && <RawModal rawRow={rawRow} setRawModal={setRawModal} rawCols={rawCols} clickedId={clickedId} setClickedId={setClickedId} />}
    </div>
  )
}
