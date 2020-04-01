import numpy as np
import pandas as pd

def beta(data):
    current = data.values
    start = np.where(np.isnan(current))[0][-1] + 1
    current = current[start+1:]
    if len(current) < 3:
        return np.NaN
    previous = data.shift(1).values[start+1:]
    l = current.shape[0]
    slope = np.linalg.lstsq(previous.reshape((l, 1)), current.reshape((l ,1)),rcond=None)[0][0][0]
    return slope

def rolling_beta(data):
    current = data.values
    previous = data.shift(1).values
    previous = previous[1:]
    current = current[1:]
    l = current.shape[0]
    if np.any(np.isnan(previous)):
        return np.NaN
    slope = np.linalg.lstsq(previous.reshape((l, 1)), current.reshape((l ,1)),rcond=None)[0][0][0]
    return slope

def calculate_forecast(cum_cases, betas):
    output = betas.iloc[[-1] * 10]
    output = output.fillna(1).cumprod()
    output = cum_cases.iloc[[-1]].pow(output,axis=0)
    output['Date'] = pd.date_range(start=cum_cases.index[-1], periods=11, freq='1D')[1:]
    output.set_index('Date',inplace=True)
    output = pd.concat([cum_cases, output])
    return output

def load_forecast_data(df):
    df = df.copy(deep=True)
    df.drop(columns=['Lat','Long'], inplace=True)
    df = df.groupby(['Date','Country_Region','Case_Type'], as_index=False).sum()
    df['Date'] = pd.to_datetime(df['Date'])

    active_cases = df[df['Case_Type'] == 'Confirmed']

    new_cases = active_cases.pivot_table(index='Date',columns=['Country_Region'],values='Difference')
    total_cases = new_cases.cumsum()
    log_total_cases = total_cases.applymap(lambda x: (np.NaN, np.log(x))[x > 100])


    # Expanding Window Regression
    expanding = log_total_cases.copy(deep=True)
    for col in expanding.columns:
        expanding[col] = expanding[col].expanding().apply(beta, raw=False)

    # 3 Day Regression
    rolling_3d = log_total_cases.copy(deep=True)
    for col in rolling_3d.columns:
        rolling_3d[col] = rolling_3d[col].rolling(window=3, min_periods=3).apply(rolling_beta, raw=False)

    # 5 Day Regression
    rolling_5d = log_total_cases.copy(deep=True)
    for col in rolling_5d.columns:
        rolling_5d[col] = rolling_5d[col].rolling(window=5, min_periods=5).apply(rolling_beta, raw=False)

    # 7 Day Regression
    rolling_7d = log_total_cases.copy(deep=True)
    for col in rolling_7d.columns:
        rolling_7d[col] = rolling_7d[col].rolling(window=7, min_periods=7).apply(rolling_beta, raw=False)

    # 10 Day Regression
    rolling_10d = log_total_cases.copy(deep=True)
    for col in rolling_10d.columns:
        rolling_10d[col] = rolling_10d[col].rolling(window=10, min_periods=10).apply(rolling_beta, raw=False)


    forecast_expanding = calculate_forecast(total_cases, expanding)
    forecast_3d = calculate_forecast(total_cases, rolling_3d)
    forecast_5d = calculate_forecast(total_cases, rolling_5d)
    forecast_7d = calculate_forecast(total_cases, rolling_7d)
    forecast_10d = calculate_forecast(total_cases, rolling_10d)

    expanding = expanding.reset_index().melt(id_vars='Date',var_name='Country')
    rolling_3d = rolling_3d.reset_index().melt(id_vars='Date', var_name='Country')
    rolling_5d = rolling_5d.reset_index().melt(id_vars='Date', var_name='Country')
    rolling_7d = rolling_7d.reset_index().melt(id_vars='Date', var_name='Country')
    rolling_10d = rolling_10d.reset_index().melt(id_vars='Date', var_name='Country')
    forecast_expanding = forecast_expanding.reset_index().melt(id_vars='Date', var_name='Country')
    forecast_3d = forecast_3d.reset_index().melt(id_vars='Date', var_name='Country')
    forecast_5d = forecast_5d.reset_index().melt(id_vars='Date', var_name='Country')
    forecast_7d = forecast_7d.reset_index().melt(id_vars='Date', var_name='Country')
    forecast_10d = forecast_10d.reset_index().melt(id_vars='Date', var_name='Country')

    df_out = expanding.merge(rolling_3d, on=['Date','Country'],how='outer')
    df_out = df_out.merge(rolling_5d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(rolling_7d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(rolling_10d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(forecast_expanding, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(forecast_3d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(forecast_5d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(forecast_7d, on=['Date', 'Country'],how='outer')
    df_out = df_out.merge(forecast_10d, on=['Date', 'Country'],how='outer')
    df_out.columns = ['Date','Country','Expanding Beta','Rolling 3 Day Beta',' Rolling 5 Day Beta', 'Rolling 7 Day Beta','Rolling 10 Day Beta','Forecast (Expanding)','Forecast (3D)','Forecast (5D)','Forecast (7D)','Forecast (10D)']
    return df_out

def main():
    df = pd.read_csv('case_data.csv')
    forecast_df = load_forecast_data(df)
    df.to_csv('case_data.csv', index=False)