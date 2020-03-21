import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import moment from 'moment'
import LinearProgress from '@material-ui/core/LinearProgress';

import './App.css';
import { CSVData, DataObj, CountryData } from './types';
import { parseData, parseCSV } from './helpers/parsers'
import Map from './components/Map';
import DataPanel from './components/DataPanel';
import OverviewTab from './components/OverviewTab';
import InfoBox from './components/InfoBox';
import DateSlider from './components/DateSlider';
import ContactIcons from './components/ContactIcons';


const geoJSONPath = 'geojson/countries.geojson';

export default function App() {
  const minDate = moment('1/22/2020', "MM/DD/YYYY").valueOf()
  let maxDate = moment('3/19/2020', "MM/DD/YYYY").valueOf()

  const [country, setCountry] = useState<CountryData | null>(null);
  const [date, setDate] = useState<number>(maxDate);
  const [csv, setCSV] = useState<CSVData[] | null>(null)
  const [data, setData] = useState<DataObj<CSVData[]> | null>(null);

  useEffect(fetchCSV, [])
  useEffect(() => filterCSV(csv!, date), [csv, date])

  function fetchCSV(): void {
    const dataPath = 'data/case_data.csv';
    d3.csv(dataPath).then(rawCSV => setCSV(parseCSV(rawCSV)));
  }

  function filterCSV(csv: CSVData[] | null, date: number): void {
    if (csv) {
      const data = {
        confirmed: csv.filter(row => row.Date === date && row['Case_Type'] === 'Confirmed'),
        deaths: csv.filter(row => row.Date === date && row['Case_Type'] === 'Deaths'),
        active: csv.filter(row => row.Date === date && row['Case_Type'] === 'Active'),
        recovered: csv.filter(row => row.Date === date && row['Case_Type'] === 'Recovered')
      }
      setData(data)
      maxDate = csv[0].Lastest_Date
    }
  }

  if (data) {

    return (
      <div id="App">
        <Map geoJSONPath={geoJSONPath} data={data.confirmed} onClickDataPoint={(d) => setCountry(d)}/>
        <DataPanel>
          <OverviewTab data={parseData(data, country)} country={country}/>
          <div>
            <div>Forecast Tab</div>
            <div>Under Development</div>
          </div>
        </DataPanel>
        <InfoBox country={country}/>
        <div id="bottom-container">
          <DateSlider date={date} minDate={minDate} maxDate={maxDate} onChange={(date: number) => setDate(date)}/>
          <ContactIcons/>
      </div>
      
    </div>
  );

  } else {

    return (
      <div id="loading-page">
        <LinearProgress/>
      </div>
        
    );
    
  }
}
