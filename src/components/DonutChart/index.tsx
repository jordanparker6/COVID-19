import React, { useRef, useState, useEffect } from 'react';

import D3Component, { Data } from './d3';
import './index.css'

export type PieData = Data;
export type Props =  { data: PieData[] };

const colour = ['#9D53FC', '#CF6679', '#BEBEBE']

export default function DonutChart(props: Props) {
    const ref = useRef<SVGSVGElement>(null);
    const [chart, setChart] = useState<D3Component | null>(null);
    const [size, setSize] = useState({ height: window.innerHeight, width: window.innerWidth });

    useEffect(initVis, [])
    useEffect(updateDatapoints, [props.data, chart]);
    useEffect(handleResizeEvent, []);
    useEffect(updateOnResize, [size])

    function initVis() {
        if (props.data && ref.current) {
            setChart(new D3Component(ref.current, colour))
        }
    }

    function updateDatapoints() {
        if (props.data && chart) {
            chart.updateData(props.data)
        }
    }

    function handleResizeEvent() {
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function() {
            setSize({ height: window.innerHeight, width: window.innerWidth });
          }, 300);
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }

    function updateOnResize() {
        chart && chart.resize();
    }

    return (
       <svg className="donut-chart" ref={ref}/>
    )
}