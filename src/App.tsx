import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import Dashboard from './views/Dashboard';
import LoadingPage from './views/LoadingPage';
import { CSVData, ForecastData } from './types';
import { parseCSV } from './helpers/parsers';

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
      },
  overrides: {
    MuiCard: {
      root: {
        borderRadius: "10px",
        backgroundColor: '#242424',
        display: "flex",
        flexDirection: "column"
      },
    }
  }
  });

export default function App() {
  const [confirmed, setConfirmed] = useState<CSVData[] | null>(null);
  const [total, setTotal] = useState<CSVData[] | null>(null);
  const [fcast_data, setForecastData] = useState<ForecastData[] | null>(null);

  useEffect(() => fetchData('data/agg_data.csv', setTotal), []);
  useEffect(() => fetchData('data/confirmed_cases.csv', setConfirmed), []);

  function fetchData(url, callback): void {
    d3.csv(url).then(rawCSV => {
      const output = parseCSV(rawCSV);
      callback(output)
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
       {(confirmed && total) ? <Dashboard confirmed={confirmed!} totals={total!}/> : <LoadingPage/>}
    </ThemeProvider>
  ); 
}
