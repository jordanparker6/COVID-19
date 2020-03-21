import React from 'react';
import { format } from 'd3';

import './index.css';
import { Data, CountryData } from '../../types';
import DonutChart from '../DonutChart';
import { PieData } from '../DonutChart/index';

export type Props = { 
  data: Data
  country: CountryData | null
}

export default function OverviewTab({ data, country }: Props) {
  const {active, deaths, recovered, confirmed } = data

  const donutData = [
    { label: "Recovered", value: recovered },
    { label: "Deaths", value: deaths },
    { label: "Active", value: active }
  ] as PieData[]

  function customFormat(data: number) {
    if (data) {
      return data.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } else {
      return 0
    }
  }
  const percentFormat = format(',.2%');
  const commaFormat = format(',');

  const mortalityRate = deaths / (recovered + deaths + active)
  const casesPerCap = (country)? `${customFormat(confirmed / parseInt(country.POP2018) * 100000)} cases per 100,000`: null

  return (
      <React.Fragment>
        <div className="tile">
          <div className="tile-title">Confirmed Cases</div>
          <div className="tile-number">{commaFormat(confirmed)}</div>
          <div className="tile-footer">{casesPerCap}</div>
        </div>
        <div className="tile">
          <div className="tile-title">Case Outcomes</div>
          <DonutChart data={donutData}/>
          <div className="tile-footer">Tooltip on Hover</div>
        </div>
        <div className="tile">
          <div className="tile-title">Mortality Rate</div>
          <div className='tile-number'>{(confirmed)?`${percentFormat(mortalityRate)}*`:null}</div>
          <div className="tile-footer">*Includes Open Cases</div>
        </div>
      </React.Fragment>
  )
}
