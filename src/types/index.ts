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
    Prep_Flow_Runtime: string
}

export type Data = {
    confirmed: number,
    active: number,
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

export type DataObj<T> = Record<keyof Data, T>
