import * as d3 from 'd3';
import { DataObj, CSVData, Data, CountryData } from '../types';

export function parseData(data: DataObj<CSVData[]>, country: CountryData | null): DataObj<number> {
    let output: Data = { confirmed: 0, deaths: 0,  recovered: 0 };
    const status = ['confirmed', 'deaths', 'recovered'] as (keyof Data)[];
      if (country) {
        status.forEach((k: keyof Data) => {
          const v = data[k];
          if (v) {
            const result = v.filter(d => country.ISO_2_CODE === d['ISO3166-1'] || country.name === d.Country_Region);
            if (result.length > 1) {
              output[k] = d3.sum(result.map(d => d.Cases));
            } else if (result && result.length) {
                output[k] = result[0].Cases;
            } else {
                output[k] = 0;
            }
          }
        });
      } else {
        status.forEach((k: keyof Data) => {
          const v = data[k];
          if (v) {
            output[k] = d3.sum(v.map(d => d.Cases));
          }
        });
      }
      return output;
  }

export function parseCSV(csv: d3.DSVRowArray): CSVData[] {
    return csv.map((row: any) => {
        row.Cases = parseInt(row.Cases as string);
        row.Difference = parseInt(row.Difference as string);
        row.Date = Date.parse(row.Date)
        row.Lat = parseFloat(row.Lat as string);
        row.Long = parseFloat(row.Long as string);
        row.Latest_Date = Date.parse(row.Latest_Date)
        return row;
    });
  }