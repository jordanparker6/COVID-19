import * as d3 from 'd3';
import moment from 'moment'
import { CSVData, CountryData, TotalsData } from '../types';

<<<<<<< HEAD
export function aggCountry(data: CSVData[], country: CountryData | null, case_type: string): TotalsData[] {
      let result = data.filter(row => row.Case_Type === case_type && row.Country_Region === "GLOBAL").map(x => ({ Cases: x.Cases, Date: x.Date }));
=======
export function parseData(data: DataObj<CSVData[]>, country: CountryData | null): DataObj<number> {
    let output: Data = { confirmed: 0, deaths: 0,  recovered: 0 };
    const status = ['confirmed', 'deaths', 'recovered'] as (keyof Data)[];
>>>>>>> 6329c2beadf63a06d27bb03426d3cc743290767d
      if (country) {
          const d = data.filter(row => row.Case_Type === case_type && ( row.iso3 === country.ISO_3_CODE || country.name === row.Country_Region ));
          if (d.length <= 0) {
            result = result.map(x => ({ ...x, Cases: 0 }))
          } else {
            result = d.map(x => ({ Cases: x.Cases, Date: x.Date }));
          }
      }
      return result;
  }

export function parseCSV(csv: d3.DSVRowArray): CSVData[] {
    const daysConst = 1000 * 60 * 60 * 24
    return csv.map((row: any) => {
        row.Cases = parseFloat(row.Cases as string);
        row.Date = Math.floor(moment(row.Date).valueOf() / daysConst) * daysConst
        row.Lat = parseFloat(row.Lat as string);
        row.Long = parseFloat(row.Long as string);
        return row;
    });
  }