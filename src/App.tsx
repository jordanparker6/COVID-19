import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import Dashboard from './views/Dashboard';
import LoadingPage from './views/LoadingPage';
import { CSVData, ForecastData } from './types';

const geoJSONPath = 'geojson/countries.geojson';
const dataPath = 'data/case_data.csv'

const theme = createMuiTheme({
  palette: {
      type: "dark",
      primary: {
          main: "#9d53fc",
          contrastText: '#ffcc00'
        },
        secondary: {
          main: '#242424',
        }
      }
    });

export default function App() {
  const [data, setData] = useState<CSVData[]> | null>(null);
  const [fcast_data, setForecastData] = useState<ForecastData[]> | null>(null);

  useEffect(fetchCSV, [])

  function fetchCSV(): void {
    d3.csv(dataPath).then(rawCSV => {
      const output = parseCSV(rawCSV);
      const maxDate = d3.max(output, row => row.Date) as number
      setData(output)
    });
  }
  
  function fetchForecast() {
    d3.json('data/forecast_data.json').then(d => {
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
    });
  }

  return (
    <ThemeProvider theme={theme}>
      {(data) ? <Dashboard/> : <LoadingPage/>}
    </ThemeProvider>
  ); 
}
