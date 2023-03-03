import {useState,useEffect} from "react";
import ECharts, { EChartsReactProps } from 'echarts-for-react';


const PieChartData = (prob) => {
    const data ={
            title: {
                text: prob.title,
                left: 'center',
                left: 100,
                top: 80,
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 100,
                top: 150,
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: '50%',
                    width: '900',
                    height: '900',
                    left: 130,
                    top:'center',
                    label: {
                        position: 'inner',
                        fontSize: 14,
                        formatter: function (params) {
                            return params.data.value
                        },
                    },
                    labelLine: {
                        show: false
                    },
                    data: prob.data,
                    color:['#2E578C','#5D9648','#E7A13D','#BC2D30','#6F3D79','#7D807F','#41699B','#6EA45A','#EAAD55','#C54346'],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    return(
        <ECharts
            option={data}
            opts={{ renderer: 'svg'}}
            style={{height: '100%', width: '100%'}}
        />
    )
}

export default PieChartData