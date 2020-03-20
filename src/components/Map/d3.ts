import * as d3 from 'd3';
import { GeoProjection, GeoPath } from 'd3';

import { CSVData as Data } from '../../types';

export type Props = { geoJSON: GeoJSON.FeatureCollection, onClickDataPoint:  (active: any) => void }

export default class D3Component {
    props: Props & { height: number, width: number };
    svg: d3.Selection<SVGElement, unknown, null, undefined>;
    map: d3.Selection<SVGGElement, unknown, null, undefined>;
    projection: GeoProjection;
    path: GeoPath;
    radius: d3.ScalePower<number, number>;
    selected: null | GeoJSON.GeoJsonProperties;
    data: Data[] | null;

    constructor(ref: SVGElement, props: Props) {
        this.svg = d3.select(ref);
        this.map = this.svg.append('g').attr('class', 'map')
        const { height, width } = this.svg.node()!.getBoundingClientRect();
        this.props = { ...props, height, width  };
        this.projection = d3.geoMercator()
            .fitSize([width, height], this.props.geoJSON).scale(width / 2 / Math.PI);
        this.path = d3.geoPath().projection(this.projection);
        this.selected = null;
        this.data = null;
        this.radius = d3.scaleSqrt().domain([0, 1000]).range([0, 2])
        this.loadMapShapes();
    }

    loadMapShapes = () => {
        let { map, props: { geoJSON, width, height, onClickDataPoint }, path, selected } = this;

        const handleClick = (el: GeoJSON.Feature) => {
            selected = (el === selected)? null : el;
            onClickDataPoint((selected)? selected.properties : selected);
            g.selectAll('path').classed('selected', el => el === selected);
            let x, y, k;
            if (selected) {
                var centroid = path.centroid(el);
                x = centroid[0];
                y = centroid[1];
                k = 4;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
            }
            
            map.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1 / k + "px");
        }

        // Add GeoJSON Shapes
        map.selectAll('.map-shapes').remove()
        const g = map.append('g').attr('class', 'map-shapes')
        g.selectAll("path")
         .data(geoJSON.features)
         .enter()
         .append("path").attr("d", path)
         .on('click', handleClick);

    }

    loadDatapoints = () => {
        const { map, radius, projection, data } = this
        if (data) {
            map.selectAll('.data-overlay').remove()
            const g = map.append('g').attr('class', 'data-overlay')
            g.selectAll("circle")
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => projection([d.Long, d.Lat])![0])
            .attr('cy', d => projection([d.Long, d.Lat])![1])
            .attr('r', d => radius(d.Cases))
        }       
    }

    updateDatapoints = (data:Data[]) => {
        this.data = data
        this.loadDatapoints()
    }

    resize = () => {
        const { height, width } = this.svg.node()!.getBoundingClientRect();
        this.props.height = height;
        this.props.width = width;
        this.projection = d3.geoMercator()
            .fitSize([width, height], this.props.geoJSON).scale(width / 2 / Math.PI)
        this.path = d3.geoPath().projection(this.projection);
        this.loadMapShapes();
        this.loadDatapoints();
    }
}