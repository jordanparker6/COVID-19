import * as d3 from 'd3';

import React, { useRef, useState, useEffect } from 'react';

import './index.css';
import LineChart, {LineChartData, ChartConfig, Props} from '../LineChart'
import { ForecastData, CountryData } from '../../types';


type TabProps = {
    data : ForecastData[]
    country : string | null
}

export default function ForecastTab(props : TabProps) {



function parse_data(data1 : Array<any>, data2 : Array<any>){
     return {Lines:[data1.map(function(data, i){return {x:data1[i],y:data2[i]}})]}
}

function transform_data(props : TabProps){
    const grouped_data = d3.nest<ForecastData, any>()
        .key(function(d){return d.Country})
        .rollup(function(v){return {'3Day':v.map(d => d.Forecast_3D), 'Expanding':v.map(d => d.Forecast_Expanding), 'Date':v.map(d => new Date(d.Date))}})
        .entries(props.data).map(d => ({'Country':d.key as string, 'Date':d.value.Date, 'Rolling':d.value['3Day'], 'Expanding':d.value.Expanding}))
        console.log('grouped')
    const filtered_data = grouped_data.filter(x => x['Country'] == (props.country == null ? 'Australia' : props.country))[0]


    const start = filtered_data['Expanding'].findIndex((val : number) => val > 0)
    const rolling = filtered_data['Rolling'].slice(start)
    const short_term = filtered_data['Rolling'].slice(start)
    const dates = filtered_data['Date'].slice(start)

    return {
        Lines:[{Line: dates.map(function(d,i){return {x:+d,y:short_term[i]}}), Key:'Short Term' + props.country},
                {Line:dates.map(function(d,i){return {x:+d,y:rolling[i]}}), Key:'Long Term' + props.country}]
    }
}

const config : ChartConfig = {
        height : 250,
        width : 250,
        marginLeft : 50,
        marginRight : 50,
        marginTop : 50,
        marginBottom : 50,
        };
   // console.log(props.country)

  return (
      <React.Fragment>
        <div className="tile">
          <div className="tile-title">ForecastData</div>
          <LineChart data={transform_data(props)} config={config} />
        </div>
        <div className="tile">
          <div className="tile-title">DataTest</div>
          <div className="tile-footer">Tooltip on Hover</div>
        </div>
      </React.Fragment>
  )
}
