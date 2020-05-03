import pandas as pd
import os, json
from datetime import datetime as dt

date = dt.today().strftime('%Y.%m.%d')

def transform(dataset):
    mappings = pd.read_csv('{}/mappings/JHU-mappings-JHU_Mappings.csv'.format(date))

    print('Transforming ', dataset)
    _dir = '{}/{}'.format(date, dataset)
    def date_parser(date):
        return pd.datetime.strptime(date, '%m/%d/%y')

    # Transform Global File
    Globalfn ='JHU-{}-Global.csv'.format(dataset)
    Global = pd.read_csv('{}/{}'.format(_dir, Globalfn))
    Global = Global.rename({"Province/State": "Province_State", "Country/Region": "Country_Region"}, axis=1)
    Global = unpivot(Global)
    
    # Adjust For US File & Transform
    USfn = 'JHU-{}-US.csv'.format(dataset)
    if os.path.exists('{}/{}'.format(_dir, USfn)):
        print('US File Found -- {} -- Adjustments Being Made'.format(USfn))
        Global = Global[Global['Country_Region'] != 'US']
        US = pd.read_csv('{}/{}'.format(_dir, USfn)).rename({"Long_": "Long"}, axis=1)
        US = US.drop(['UID', 'iso2', 'iso3', 'code3', 'FIPS', 'Admin2', 'Combined_Key'], axis=1)
        try:
            US = US.drop(['Population'], axis=1)
        except KeyError as error:
            pass
        #US = US.dropna()
        US = unpivot(US)
        Global = Global.append(US)

    # Join ISO Country Codes
    countries = mappings.drop_duplicates('Country_Region').set_index('Country_Region')
    Global = Global.join(countries.loc[:, ['iso2', 'iso3']], on="Country_Region", how="outer")
    
    # Add Case Type
    Global['Case_Type'] = dataset

    # Parse Dates
    Global['Date'] = Global['Date'].map(date_parser)

    # Filter Out Shit Entries

    return Global

def unpivot(df):
    cols = ["Province_State", "Country_Region", 'Lat', 'Long', 'Source']
    return pd.melt(df, id_vars=cols).rename({"variable": "Date", "value": "Cases"}, axis=1)

def aggregate(df):
    df = df.groupby(['Case_Type', 'Country_Region', 'iso3', 'Date'], as_index=False)['Cases'].sum()
    gdf = df.groupby(['Case_Type', 'Date'], as_index=False).agg({"Cases":"sum"})
    gdf['Country_Region'] = "GLOBAL"
    df = df.append(gdf)
    return df

def calculate_mortality(df):
    confirmed = df[df['Case_Type'] == 'confirmed'].set_index(['Country_Region', 'Date'])
    deaths = df[df['Case_Type'] == 'deaths'].set_index(['Country_Region', 'Date'])['Cases']
    mortality = confirmed.join(deaths, rsuffix='.deaths')
    mortality['Cases'] = (mortality['Cases.deaths'] / mortality['Cases']).fillna(0)
    mortality['Case_Type'] = 'mortality'
    mortality = mortality.drop('Cases.deaths', axis=1)
    mortality.reset_index(inplace=True)
    return df.append(mortality)

def main():
    print('Transforming data...')
    data = pd.DataFrame(columns=["Province_State", "Country_Region", 'Lat', 'Long', 'Date', 'Cases', 'Case_Type', 'iso2', 'iso3', 'Source'])
    datasets = ['confirmed', 'deaths', 'recovered']
    for dataset in datasets:
        data = data.append(transform(dataset), sort=False)
    
    print('Saving transformed dataset..')
    data.to_csv('{}/data.csv'.format(date), index=False)
    
    print('Saving confirmed cases dataset..')
    confirmed = data[(data['Case_Type'] == 'confirmed') & ~data['Lat'].isna()]
    confirmed.to_csv('{}/confirmed_cases.csv'.format(date), index=False)
    
    print('Saving aggregated dataset..')
    agg = aggregate(data)
    agg = calculate_mortality(agg)
    agg.to_csv('{}/agg_data.csv'.format(date), index=False)

    print('Transformation complete.')

if __name__ == "__main__":
    main()