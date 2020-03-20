import * as d3 from 'd3';

export type Data = { value: number, label: string }

export default class D3Component {
    height: number;
    width: number;
    radius: number;
    colour: d3.ScaleOrdinal<string, string>;
    svg: d3.Selection<SVGElement, unknown, null, undefined>;
    pie: d3.Pie<any, Data>;
    arc: d3.Arc<any, d3.PieArcDatum<Data>>;
    data: Data[] | null;

    constructor(ref: SVGElement, colour: string[]) {
        this.svg = d3.select(ref);
        this.data = null;
        this.colour = d3.scaleOrdinal(colour);
        const { height, width } = this.svg.node()!.getBoundingClientRect();
        this.height = height;
        this.width = width;
        this.radius = Math.min(this.width, this.height) / 2;
        this.pie = d3.pie<Data>().value(d => d.value).sort(null)
        this.arc = d3.arc<d3.PieArcDatum<Data>>().outerRadius(this.radius * 0.9)
                           .innerRadius(this.radius * 0.7)
                           .cornerRadius(3)
                           .padAngle(0.030);
        this.svg.attr('width', width).attr('height', height)
    }

    buildChart = () => {
        const { svg, pie, colour, arc, radius, height, width, data} = this
        svg.selectAll('.chart').remove()
        const g = svg.append('g').attr('class', 'chart')
                     .attr("transform", `translate(${width/2}, ${height/2})`); 

        const total = d3.sum(data!.map(d => d.value))

        if (data) {
            // add and colour the donut slices
            const arcs = g.datum(data).selectAll('.slice').data(pie).enter()
                          .append('g').attr('class', 'slice')
                          .append('path')
                          .attr('fill', (d: d3.PieArcDatum<Data>) => colour(d.data.label))
                          .attr('d', arc);
        }

        d3.selectAll<any, d3.PieArcDatum<Data>>('.slice path').call(toolTip);

        // add tooltip (svg circle element) when mouse enters label or slice
        function toolTip(selection:d3.Selection<any, d3.PieArcDatum<Data>, HTMLElement, any>) {
            selection.on('mouseenter', d => {
                g.append('circle')
                    .attr('class', 'toolCircle')
                    .attr('r', radius * 0.65)
                    .style('fill', colour(d.data.label))
                    .style('fill-opacity', 0.8);
                g.append('text')
                    .attr('class', 'toolCircle')
                    .attr('dy', -13)
                    .html(toolTipHTML(d))
                    .style('font-size', '.9rem')
                    .style('text-anchor', 'middle');
            });
            selection.on('mouseout', function () {
                d3.selectAll('.toolCircle').remove();
            });
        }

        function toolTipHTML(d:d3.PieArcDatum<Data>) {
            const percentFormat = d3.format(',.2%');
            const value = d.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return (`
                <tspan x="0">${d.data.label}<tspan>
                <tspan x="0" dy="1.2rem">${value}<tspan>
                <tspan x="0" dy="1.2rem">${percentFormat(d.data.value / total)}</tspan>
            `)
        }
    }

    updateData = (data: Data[]) => {
        this.data = data;
        this.buildChart();
    }

    resize = () => {
        const { height, width } = this.svg.node()!.getBoundingClientRect();
        this.height = height;
        this.width = width;
        this.radius = Math.min(this.width, this.height) / 2;
        this.pie = d3.pie<Data>().value(d => d.value).sort(null)
        this.arc = d3.arc<d3.PieArcDatum<Data>>().outerRadius(this.radius * 0.95)
                           .innerRadius(this.radius * 0.75)
                           .cornerRadius(3)
                           .padAngle(0.030);
        this.svg.attr('width', width).attr('height', height)
        this.buildChart()
    }
}  
