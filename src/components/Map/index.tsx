import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import "./index.css";
import { CSVData as Data } from '../../types';
import D3Component, { Props as D3Props } from './d3';

export type Props = { geoJSONPath: string, data: Data[] | null, onClickDataPoint: (active: any) => void  }

export default function Map(props: Props) {
    const [map, setMap] = useState<D3Component | null>(null);
    const [size, setSize] = useState({ height: window.innerHeight, width: window.innerWidth });
    const [geoJSON, setGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);
    const ref = useRef<SVGSVGElement>(null);

    useEffect(fetchGeoJSON, []);
    useEffect(initVis, [geoJSON]);
    useEffect(updateDatapoints, [props.data, map]);
    useEffect(handleResizeEvent, []);
    useEffect(updateOnResize, [size]);

    function fetchGeoJSON() {
        d3.json<GeoJSON.FeatureCollection>(props.geoJSONPath).then(data => setGeoJSON(data));
    }

    function initVis() {
        if (geoJSON && ref.current) {
            const d3Props: D3Props = {
                geoJSON,
                onClickDataPoint: props.onClickDataPoint
            }
            setMap(new D3Component(ref.current, d3Props));
        }
    }

    function updateDatapoints() {
        if (props.data && map) {
            map.updateDatapoints(props.data);
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
        map && map.resize();
    }

    return (
        <svg className="map" ref={ref}/>
    )
}

