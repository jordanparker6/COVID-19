import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid"

import './index.css';
import { DataObj, CountryData, TotalsData } from '../../types';
import DonutChart from '../DonutChart';
import { PieData } from '../DonutChart/index';
import StatsTile from '../StatsTile'

export type Props = { 
  data: DataObj<TotalsData[]>,
  country: CountryData | null,
  date: number
}

export default function OverviewTab({ data, country, date }: Props) {
  let {deaths, recovered, confirmed, mortality } = data

  const filterToday = (data: TotalsData[], date) => {
    const today = data.filter(x => x.Date === date).map(x => x.Cases)[0]
    return (today) ? today : 0
  }
  
  const today = {
    confirmed: filterToday(confirmed, date),
    recovered: filterToday(recovered, date),
    deaths: filterToday(deaths, date),
    mortality: filterToday(mortality, date)
  }

  const donutData = [
    { label: "Recovered", value: today.recovered },
    { label: "Deaths", value: today.deaths },
    { label: "Active", value: today.confirmed - today.recovered - today.deaths }
  ] as PieData[]

  const percentChange = (data: TotalsData[], date) => {
    const d = data.filter(x => x.Date <= date).map(x => x.Cases)
    const last = (d[d.length - 2]) ? d[d.length - 2] : 0;
    return (d[d.length - 1] - last) / last
  }

  const casesPerCap = (country)? `${(today.confirmed / parseInt(country.POP2018) * 100000).toLocaleString()} cases per 100,000`: ""

  const confirmedTileProps = {
    id: "confirmed",
    label: "Confirmed Cases",
    percentage: percentChange(confirmed, date),
    value: today.confirmed.toLocaleString(),
    footer: casesPerCap,
    color: "rgb(157, 84, 252)",
    chartData: {
      datasets: [
        {
        label: "Confirmed",
        borderWidth: 2,
        backgroundColor: "rgb(157, 84, 252, 0.2)",
        borderColor: "rgb(157, 84, 252)",
        data: confirmed.map(x => x.Cases)
        },
        {
          label: "Confirmed Point",
          pointColor: "rgb(157, 84, 252)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [28]
        }
        ],
      labels: new Array(confirmed.length).fill(null)
    }
  }

  const mortalityTileProps = {
    id: "mortality-rate",
    label: "Mortality Rate",
    percentage: percentChange(mortality, date),
    value: (today.mortality * 100).toLocaleString() + "%",
    color: "rgb(220, 20, 60)",
    footer: "*Includes Open Cases",
    chartData: {
      datasets: [
        {
        label: "Mortality Rate",
        borderWidth: 2,
        backgroundColor: "rgb(220, 20, 60, 0.2)",
        borderColor: "rgb(220, 20, 60)",
        data: mortality.map(x => x.Cases)
      }
      ],
      labels: new Array(mortality.length).fill(null)
    }
  }

  return (
      <React.Fragment>
          <Grid item>
              <StatsTile {...confirmedTileProps}/>
          </Grid>
          <Grid item>
            <Card className="tile">
              <div className="tile-title">Case Outcomes</div>
              <div className='tile-body'>
                <DonutChart data={donutData}/>
              </div>
              <div className="tile-footer">Tooltip on Hover</div>
            </Card>
          </Grid>
          <Grid item>
            <StatsTile {...mortalityTileProps}/>
          </Grid>
      </React.Fragment>
  )
}
