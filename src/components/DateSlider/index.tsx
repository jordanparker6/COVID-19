import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import './index.css'

const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "rgb(85, 0, 233)",
                contrastText: '#B3B3B3'
              },
              secondary: {
                main: '#242424',
              }
            }
          });

export type Props = { date: number, minDate: number, maxDate: number, onChange: (date: number) => void, timeInterval: number }

export default function DateSlider(props:Props) {
  const minDays = 0;
  const maxDays = (props.maxDate- props.minDate)  / (1000*60*60*24);
  const [value, setValue] = useState(maxDays);
  const [play, setPlay] = useState(false);

  useEffect(intervalEffect, [play, value])

  const valueToDate = (value:number) => props.minDate + value * 1000*60*60*24
  
  function setDateAndValue(value:number) {
    setValue(value)
    props.onChange(valueToDate(value))
  }

  function handleChange(e: React.ChangeEvent<{}>, value: number | number[]) {
    setDateAndValue(value as number)
  }

  function intervalEffect() {
    let interval: null | NodeJS.Timeout = null
    if (play && (value <= (maxDays -1))) {
      interval = setInterval(() => {
        setDateAndValue(value + 1)
      }, props.timeInterval);
    } else {
      clearInterval(interval!);
      setPlay(false)
    }
    return () => clearInterval(interval!);
  }

  function onClickPlay() {
    if (play) {
      setPlay(false)
    } else {
      setValue(0);
      setPlay(true);
    }
  }

  return (
    
    <ThemeProvider theme={theme}>
      <div id="date-slider">
        <div className="date-slider-title">WHO Situation Report | {new Date(props.date + 1000 * 60 * 60 * 24).toDateString()}</div>
        <div className="date-slider-container">
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
          onClick={onClickPlay}
          variant="contained"
          color="primary"
          >
            {(play)? "Pause" : "Play"}
          </Button>
        </div>
        <div className="date-slider-footer">Date Slider</div>    
      </div>
    </ThemeProvider>
      
  


  )
}