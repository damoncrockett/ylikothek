import React, { useState, useEffect } from 'react';
import { select } from 'd3-selection';

const row = new Array(5).fill('material data cell');
const arr = new Array(100).fill(0);


export default function App() {

  useEffect(() => {

    select("#colhead")
      .selectAll("tr")
      .data([0])
      .enter()
      .append("tr")
      .each(function(d) {
        select(this)
          .selectAll("th")
          .data(row)
          .enter()
          .append("th")
          .text(r => r)
        })

    select("#tabular")
      .selectAll("tr")
      .data(arr)
      .enter()
      .append("tr")
      .each(function(d) {
        select(this)
          .selectAll("td")
          .data(row)
          .enter()
          .append("td")
          .text(r => '_' + r )
      })
  },[])

  return (
    <div id='app'>
      <div id='banner'>
        <span id='title'>ylikothek</span>
        <span id='subtitle'>MATERIALS DATABASE</span>
      </div>
      <div id='viewpane'>
        <table id='colhead'></table>
        <div id='tablebox'>
          <table id='tabular'></table>
        </div>
      </div>
    </div>
  )
}
