import React, { useState, useEffect } from 'react';
import { select } from 'd3-selection';
import { data } from './data';

const cols = ['INSTITUTION', 'CATALOG NO.', 'FULL BARCODE', 'COMMON NAME',
              'SAMPLE TYPE', 'ACQUISITION DATE', 'GEOGRAPHIC ORIGIN',
              'MANUFACTURER', 'AVAILABLE DATA', 'COLOR'];

export default function App() {

  useEffect(() => {

    select("#thead")
      .selectAll("tr")
      .data([0])
      .enter()
      .append("tr")
      .each(function(d) {
        select(this)
          .selectAll("th")
          .data(cols)
          .enter()
          .append("th")
          .text(r => r)
        })

    select("#tbody")
      .selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .each(function(d) {
        select(this)
          .selectAll("td")
          .data(d)
          .enter()
          .append("td")
          .text(r => r )
      })
  },[])

  return (
    <div id='app'>
      <div id='banner'>
        <span id='title'>ylikothek</span>
        <span id='subtitle'>MATERIALS DATABASE</span>
      </div>
      <div id='viewpane'>
        <table id='tabular'>
          <thead id='thead'></thead>
          <tbody id='tbody'></tbody>
        </table>
      </div>
    </div>
  )
}
