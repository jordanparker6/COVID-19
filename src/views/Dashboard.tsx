import React, { useState } from 'react';
import moment from 'moment'
import * as d3 from 'd3';
import Grid from "@material-ui/core/Grid";
import Hidden from '@material-ui/core/Hidden';

import { CSVData, CountryData } from '../types';
import { aggCountry } from '../helpers/parsers';

import Map from '../components/Map';
import DataPanel from '../components/DataPanel';
import OverviewTab from '../components/OverviewTab';
// import ForecastTab from './components/ForecastTab';
import InfoBox from '../components/InfoBox';
import DateSlider from '../components/DateSlider';
import ContactIcons from '../components/ContactIcons';

const geoJSONPath = 'geojson/countries.geojson';

type Props = { 
  confirmed: CSVData[], totals: CSVData[]
}

const Dashboard = ({ confirmed, totals }: Props) => {
  const daysConst = 1000*60*60*24;

  const [country, setCountry] = useState<CountryData | null>(null);
  const minDate = Math.floor(moment('22/01/2020', "DD/MM/YYYY").valueOf() / daysConst) * daysConst;
  const maxDate = d3.max(confirmed, row => row.Date) as number;
  const [date, setDate] = useState<number>(maxDate);

  const data = {
    confirmed: confirmed,
    totals: {
      confirmed: aggCountry(totals, country, 'confirmed'),
      deaths: aggCountry(totals, country, 'deaths'),
      recovered: aggCountry(totals, country, 'recovered'),
      mortality: aggCountry(totals, country, 'mortality'),
    }
  }

  // need to add currenty to current confirmed
  const currentData = {
    confirmed: confirmed.filter(row => row.Date === date)
  }

  return (
      <Grid id="dashboard" container spacing={1}>
        <Hidden smDown={true}>
          <Grid item md={8} lg={9} style={{ position: "relative" }}>

              <Map geoJSONPath={geoJSONPath} data={currentData.confirmed} onClickDataPoint={(d) => setCountry(d)}/>
              <InfoBox country={country}/>
              <div id="bottom-container">
                <DateSlider date={date} minDate={minDate} maxDate={maxDate} timeInterval={500} onChange={(value:number) => setDate(value)}/>
                <ContactIcons/>
              </div>

          </Grid>
        </Hidden>
        <Grid item lg={3} md={4} xs={12}>
          <DataPanel>
            <OverviewTab data={data.totals} country={country} date={date}/>
            <div>
              <div>Forecast Tab</div>
              <div>Under Development</div>
            </div>
          </DataPanel>
        </Grid>
      </Grid>
    );
}

export default Dashboard;