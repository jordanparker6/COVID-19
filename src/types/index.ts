export type CSVData = { 
    Lat: number, 
    Long: number, 
    Date: number,
    Cases: number,
    Case_Type: string,
    Country_Region: string, 
    Providence_State: string,
    Difference: number,
    Latest_Date: number,
    'ISO3166-1': string,
    'ISO3166-2': string
}

export type Data = {
    confirmed: number,
    deaths: number,
    recovered: number
}

export type CountryData = {
    ISO_3_CODE: string,
    ISO_2_CODE: string,
    AREA: string,
    NAME_1: string,
    POP2005: string,
    REGION: string,
    GMI_CNTRY: string,
    NAME_12: string,
    name: string,
    POP2018: string
}

export type ForecastData = {
    Date: number,
    Country: string,
    ExpandingBeta: number,
    Rolling3Day_Beta: number,
    Rolling5Day_Beta: number,
    Rolling7Day_Beta: number,
    Rolling10Day_Beta: number,
    Forecast_Expanding: number,
    Forecast_3D: number,
    Forecast_5D: number,
    Forecast_7D: number,
    Forecast_10D: number
}


export type DataObj<T> = Record<keyof Data, T>