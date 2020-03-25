import pandas as pd

def download_data():
    url = 'https://s3-us-west-1.amazonaws.com/starschema.covid/JHU_COVID-19.csv'
    cols = ['Country/Region', 'Province/State',	'Date', 'Case_Type', 'Cases', 'Long', 'Lat', 'ISO3166-1', 'ISO3166-2', 'Difference', 'Last_Update_Date']
    header = ['Country_Region', 'Province_State',	'Date', 'Case_Type', 'Cases', 'Long', 'Lat', 'ISO3166-1', 'ISO3166-2', 'Difference', 'Latest_Date']
    df = pd.read_csv(url, usecols=cols)
    df.to_csv('case_data.csv', index=False, header=header)

download_data()