/**
 * Created by hao.cheng on 2017/4/21.
 */
import React,{Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush} from 'recharts';
const data = [
    {name: 'Page A13s sdg sgsg sggsg s', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G1', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G2', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G3', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G4', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G5', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G6', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G7', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G8', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page G9', uv: 3490, pv: 4300, amt: 2100},
];
class RechartsBarChart extends Component {

    render () {
        if(this.props.data.length>0){
            const width = `${100*(this.props.data.length/5)}%`;//一屏显示5个bar
            return (
                <div style={{overflowY:"hidden"}}>
                    <ResponsiveContainer width={width} height={300} >
                        <BarChart
                            data={this.props.data}
                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                        >
                            <XAxis dataKey="name"/>
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="本仓库期初库存" fill="#8884d8" />
                            <Bar dataKey="本仓库期末库存" fill="#82ca9d"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            );
        }else{
            return <div></div>
        }

    }

}


export default RechartsBarChart;