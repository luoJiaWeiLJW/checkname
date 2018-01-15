/**
 * Created by hao.cheng on 2017/4/21.
 */
import React,{Component} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const data = [
    {name: 'Page A', 本仓库期初库存: "0", 本仓库期末库存: "2"},
    {name: 'Page B', 本仓库期初库存: "0", 本仓库期末库存: "2"},

];
class RechartsLineChart extends Component {

    render () {
        if(this.props.data.length>0){
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={this.props.data}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="本仓库期初库存" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="本仓库期末库存" stroke="#82ca9d"/>
                    </LineChart>
                </ResponsiveContainer>
            );
        }else{
            return <div></div>
        }

    }

}


export default RechartsLineChart;