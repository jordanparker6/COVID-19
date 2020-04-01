import pandas as pd

def transform(df):


def unpivot(df):
    US = ['time_series_covid19_{}_US'.format(x) for x in ['deaths', 'confirmed']]
    Global = ['time_series_covid19_{}_US'.format(x) for x in ['deaths', 'confirmed', 'recovered']]
    
    if US:
        cols = ["UID","iso2","iso3","code3","FIPS","Admin2","Province_State","Country_Region","Lat","Long_","Combined_Key"]
    else:
        cols = 
    
    df = pd.melt(df, id_vars=cols)