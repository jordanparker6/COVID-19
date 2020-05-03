import React, { useRef, useEffect } from "react";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles"
import { ChartOptions, ChartConfiguration, ChartData } from 'chart.js';
import Chart from 'chart.js';

export type Props = { 
  id: string,
  label: string, 
  value: string, 
  percentage: number,
  color?: string,
  footer?: string,
  chartConfig?: ChartConfiguration,
  chartOptions?: ChartOptions,
  chartData: ChartData
 }

const StatsTile = (props:Props) => {
  const { label, value, percentage, chartData } = props;
  const ref = useRef<HTMLCanvasElement>(null);

  // Chart Options
  const chartOptions: ChartOptions = {
    ...{
      layout: {
        padding: {
          left: -10,
          bottom: -10,
          right: 0,
          top: 0
        }
      },
      maintainAspectRatio: true,
      responsive: true,
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0,
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: 0.33
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              display: false
            },
            gridLines: {
              drawOnChartArea: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              display: false,
              // Avoid getting the graph line cut of at the top of the canvas.
              // Chart.js bug link: https://github.com/chartjs/Chart.js/issues/4790
              suggestedMax: Math.max(...chartData.datasets![0].data as number[])
            },
            gridLines: {
              drawOnChartArea: false
            }
          }
        ]
      }
    },
    ...props.chartOptions
  };

  // Chart Config Object
  const chartConfig: ChartConfiguration = {
    ...{
      type: "line",
      data: chartData,
      options: chartOptions
    },
    ...props.chartConfig
  };

  // Percent Change Styles
  let color: string, backgroundImage: string;
  if (percentage * 100 > 0.005) {
    color = "#17C671"
    backgroundImage = "url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMTdjNjcxIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHBhdGggZD0iTTcgMTRsNS01IDUgNXoiLz4gPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiA8L3N2Zz4=)"
  } else if (percentage * 100 < -0.005) {
    color = "#C4183C"
    backgroundImage = "url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjYzQxODNjIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcgMTBsNSA1IDUtNXoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)"
  } else {
    color = "#C1C1C1"
    backgroundImage = ""
  }

  // Componet Styles
  const useStyles = makeStyles({
    root: {
      position: "relative"
    },
    chart: {
      bottom: 0,
      opacity: 0.5,
      position: "absolute"
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "18rem",
      alignItems: "stretch",
      padding: "0.5rem",
      position: "relative"
    },
    value: {
      fontSize: "5rem",
      color: props.color,
      flexGrow: 1,
      display: "flex",
      paddingTop: "4rem",
      justifyContent: "center"
    },
    label: {
      fontSize: "1.3rem",
      letterSpacing: "0.0625rem",
      color: "#FFFFFF",
      opacity: 0.6
    },
    header: {
      textAlign: "left",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footer: {
      color: "#FFFFFF",
      opacity: 0.38,
      textAlign: "right",
      padding: "0.5rem",
      fontSize: "0.9rem"
    },
    percentage: {
      position: "relative",
      display: "table",
      paddingLeft: "0.9375rem",
      color: color,
      fontSize: "1rem",
      '&::before': {
        content: "''",
        width: "0.75rem",
        height: "0.375rem",
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundImage: backgroundImage
        }

      }
  });
  const classes = useStyles();

  // Render Chart
  useEffect(() => {
    if (ref.current) {
      const chart = new Chart(ref.current, chartConfig)
      return () => { chart.destroy() }
    }
  }, [ref, chartConfig]);

  return (
    <Card className={classes.root}>
        <div className={classes.container}>
            <div className={classes.header}>
              <span className={classes.label}>{label}</span> 
              <span className={classes.percentage}>{(percentage * 100).toFixed(2)+"%"}</span>
            </div>
            <div className={classes.value}>
              <span >{value}</span>
            </div>
            <div className={classes.footer}>
              <span>{props.footer}</span>
            </div>
        </div>
        <canvas
            height={180}
            ref={ref}
            className={classes.chart}
        />
    </Card>
  );
}

StatsTile.defaultProps = {
  increase: true,
  percentage: "",
  value: "NaN",
  color: "rgb(255,65,105)",
  label: "",
  chartData: {
    datasets: [
      {
        label: "",
        fill: "",
        borderWidth: 1.5,
        backgroundColor: "rgba(255,65,105,0.1)",
        borderColor: "rgb(255,65,105)",
        data: []
      }
    ],
    labels: []
  }
};

export default StatsTile;