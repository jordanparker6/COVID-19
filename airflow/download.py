import pandas as pd
import os
from datetime import datetime as dt

urls = {
    "confirmed": {
        "US": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv", 
        "Global": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    }, 
    "deaths": {
        "US": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv",
        "Global": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
    },
    "recovered": {
        "Global":"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
    },
    "mappings": {
        "JHU_Mappings": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv"
    }
}

def main():
    date = dt.today().strftime('%Y.%m.%d')
    datasets = ['confirmed', 'recovered', 'deaths', 'mappings']
    for dataset in datasets:
        _dir = '{}/{}'.format(date, dataset)
        os.makedirs(_dir)
        for item, url in urls[dataset].items():
            print("Downloading from: ", url)
            df = pd.read_csv(url)
            df['Source'] = url
            df.to_csv('{}/{}'.format(_dir, "JHU-{}-{}.csv".format(dataset, item)), index=False)

if __name__ == "__main__":
    main()