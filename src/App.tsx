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
const dataPath = 'data/case_data.csv'

export default function App() {
  const minDate = moment('1/22/2020', "MM/DD/YYYY").valueOf()
  const initialMaxDate = moment('3/13/2020', "MM/DD/YYYY").valueOf()

  const [country, setCountry] = useState<CountryData | null>(null);
  const [date, setDate] = useState<number>(initialMaxDate);
  const [maxDate, setMaxDate] =useState<number>(initialMaxDate);
  const [csv, setCSV] = useState<CSVData[] | null>(null)
  const [data, setData] = useState<DataObj<CSVData[]> | null>(null);

  useEffect(fetchCSV, [])
  useEffect(() => filterCSV(csv!, date), [csv, date])

  function fetchCSV(): void {;
    d3.csv(dataPath).then(rawCSV => {
      const output = parseCSV(rawCSV);
      const maxDate = d3.max(output, row => row.Date) as number
      setCSV(output);
      setMaxDate(maxDate);
      setDate(maxDate);
    });
  }

  function filterCSV(csv: CSVData[] | null, date: number): void {
    if (csv) {
      const data = {
        confirmed: csv.filter(row => row.Date === date && row['Case_Type'] === 'Confirmed'),
        deaths: csv.filter(row => row.Date === date && row['Case_Type'] === 'Deaths'),
        recovered: csv.filter(row => row.Date === date && row['Case_Type'] === 'Recovered')
      }
      setData(data)
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
