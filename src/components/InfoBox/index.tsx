import React from 'react';

import "./index.css"
import { CountryData } from '../../types';

type Props = { country: CountryData | null }

export default function DataPanel(props:Props) {
    let pop;
    let name;
    if (props.country) {
        name = props.country.NAME_12
        pop = (parseInt(props.country.POP2018) / 1000000).toFixed(2)
        pop = pop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div id="info-box">
            <p>{name}</p>
            <p>{(props.country)? `Population: ${pop}M`: "COVID-19 | Dashboard"}</p>
        </div>
    );
}