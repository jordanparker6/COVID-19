import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import './index.css'

const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "rgb(85, 0, 233)",
                contrastText: '#ffcc00'
              },
              secondary: {
                main: '#242424',
              }
            }
          });

export type Props = { date: number, minDate: number, maxDate: number, onChange: (date: number) => void }

export default function DateSlider(props:Props) {
  const minDays = 0;
  const maxDays = (props.maxDate- props.minDate)  / (1000*60*60*24);
  const [value, setValue] = useState(maxDays);

  const valueToDate = (value:number) => props.minDate + value * 1000*60*60*24

  function handleChange(e: React.ChangeEvent<{}>, value: number | number[]) {
    setValue(value as number)
    props.onChange(valueToDate(value as number));
  }

  function annimateSlider() {
    for (let i = 0; i <= maxDays; i++) {
      
      setTimeout(()=>{
        console.log(value);
        setValue(i);
        props.onChange(valueToDate(value))
      }, 1 * 1000)
    }

  }

  return (
    
    <ThemeProvider theme={theme}>
      <div id="date-slider">
        <div>COVID-19 | {new Date(props.date).toDateString()}</div>
        <div id="date-slider-annimation">
          <Slider 
          value={value}
          valueLabelDisplay="auto"
          step={1}
          min={minDays}
          max={maxDays}
          onChange={handleChange}
          color="primary"
          />
          <Button 
          style={{marginLeft: '1rem'}}
          onClick={annimateSlider}
          variant="outlined"
          color="primary"
          >
            Play
          </Button>
        </div>
        <div>Date Slider</div>    
      </div>
    </ThemeProvider>
      
  


  )
}