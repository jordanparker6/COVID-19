import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import moment from 'moment'
import LinearProgress from '@material-ui/core/LinearProgress';

import './App.css';
import { CSVData, DataObj, CountryData, ForecastData} from './types';
import { parseData, parseCSV } from './helpers/parsers'
import Map from './components/Map';
import DataPanel from './components/DataPanel';
import OverviewTab from './components/OverviewTab';
import ForecastTab from './components/ForecastTab';
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
  const [fcast_data, setForecastData] = useState<Array<ForecastData> | null>(null);

  useEffect(fetchCSV, [])
  useEffect(() => filterCSV(csv!, date), [csv, date])

  function fetchCSV(): void {;
    const forecastPath = 'data/forecast_data.json'
    d3.csv(dataPath).then(rawCSV => {
      const output = parseCSV(rawCSV);
      const maxDate = d3.max(output, row => row.Date) as number
      setCSV(output);
      setMaxDate(maxDate);
      setDate(maxDate);
    });
    d3.json(forecastPath).then(d => {
        const fcast = d.map(
        function(row : any){
        if (row['Country'] == 'China'){console.log(row)}
        return {
            Date: +row['Date'] as number,
            Country: row['Country'] as string,
            ExpandingBeta: +row['Expanding Beta'],
            Rolling3Day_Beta: +row['Rolling 3 Day Beta'],
            Rolling5Day_Beta: +row['" Rolling 5 Day Beta'],
            Rolling7Day_Beta: +row['Rolling 7 Day Beta'],
            Rolling10Day_Beta: +row['Rolling 10 Day Beta'],
            Forecast_Expanding: +row['Forecast (Expanding)'],
            Forecast_3D: +row['Forecast (3D)'],
            Forecast_5D:+row['Forecast (5D)'],
            Forecast_7D:  +row['Forecast (7D)'],
            Forecast_10D: +row['Forecast (10D)']
        } as ForecastData
        } );
        setForecastData(fcast);
  })}



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

  if (data && fcast_data) {
    return (
      <div id="App">
        <Map geoJSONPath={geoJSONPath} data={data.confirmed} onClickDataPoint={(d) => setCountry(d)}/>
        <DataPanel>
          <OverviewTab data={parseData(data, country)} country={country}/>
          <ForecastTab data={fcast_data} country={country == null ? null : country.NAME_1}/>
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
