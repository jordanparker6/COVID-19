import React, {
    Component,
    useRef,
    useEffect,
    useState
} from 'react'
import * as d3 from 'd3';

export type Point = {
    x: number;
    y: number;
};

export type Line = {
    Line: Point[],
    Key: string
}

export type LineChartData = {
    Lines: Line[];
}

export type ChartConfig = {
    width: number;
    height: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
}

type D3_SVG = d3.Selection < SVGGElement, unknown, null, undefined >

    export interface Props {
        data: LineChartData;
        config: ChartConfig
    }

export default function LineChart(props: Props) {
    const divElement = useRef(null)
    const [svg, setSVG] = useState < D3_SVG | null > (null);

    useEffect(
        () => {
            if (divElement.current && (svg == null)) {
                setSVG(
                    d3.select(divElement.current)
                    .attr('width', props.config.width + props.config.marginLeft + props.config.marginRight)
                    .attr('height', props.config.height + props.config.marginTop + props.config.marginBottom)
                    .append('g')
                    .attr('transform', 'translate(' + props.config.marginLeft + ',' + props.config.marginTop + ')') as D3_SVG
                )
            }
            if (svg && props.data) {

                const lines = props.data.Lines
                const x = d3.scaleTime()
                    .domain([d3.min(lines, line => d3.min(line.Line, point => point.x)) as number, d3.max(lines, line => d3.max(line.Line, point => point.x)) as number])
                    .range([0, props.config.width])

                const y = d3.scaleLinear()
                    .domain([d3.min(lines, line => d3.min(line.Line, point => point.y)) as number, d3.max(lines, line => d3.max(line.Line, point => point.y)) as number])
                    .range([props.config.height, 0])

                const line_generator = d3.line < Point > ().x(p => x(p.x))
                    .y(p => y(p.y))

                const paths = svg.selectAll < SVGSVGElement,Line >('.line').data(lines, (line : Line) => line.Key).join(
                        function(enter) {
                            return enter.append('path')
                        },
                        function(update) {
                            return update
                        },
                        function(exit) {
                            return exit.transition().attr('y', '0').remove()
                        }) //.transition().duration(200)

                console.log(paths)
                paths.attr('class', 'line')
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.25)
                    .attr('d', function(d) {
                        return line_generator(d.Line)
                    })
                    .transition().duration(1000)

                const yAxis = d3.axisLeft(y)

                const yG = svg.selectAll < SVGSVGElement,
                    number > ('.yaxis').data([1]).join(
                        enter => enter.append('g'))
                    .attr('class', 'yaxis').transition().duration(1000)
                yG.call(yAxis)

                const xAxis = d3.axisBottom(x).ticks(5)
                const xG = svg.selectAll < SVGSVGElement,
                    number > ('.xaxis').data([1]).join(
                        enter => enter.append('g'))
                    .attr('transform', "translate(0," + (props.config.height) + ")")
                    .attr('class', 'xaxis')
                    .transition().duration(1000)
                xG.call(xAxis)

            }

        },
        [props.data, divElement.current])

    return ( < svg ref = {
            divElement
        }
        />)
    }

