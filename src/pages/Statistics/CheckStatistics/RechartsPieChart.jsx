/**
 * Created by hao.cheng on 2017/4/21.
 */
import React,{Component} from 'react';
import {PieChart, Pie,Sector,Tooltip, ResponsiveContainer,Cell,Legend} from 'recharts';


const data01 = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
    {name: 'Group C', value: 300}, {name: 'Group D', value: 200},
    {name: 'Group E', value: 278}, {name: 'Group F', value: 189}]

const data02 = [{name: 'Group A', value: 2400}, {name: 'Group B', value: 4567},
    {name: 'Group C', value: 1398}, {name: 'Group D', value: 9800},
    {name: 'Group E', value: 3908}, {name: 'Group F', value: 4800}];
const RADIAN = Math.PI / 180;
const renderLegend = ()=>{
    return(
        <p style={{textAlign:"center"}}>
            <span style={{width:16,height:16,backgroundColor:"#8884d8",display:"inline-block",marginRight:2,verticalAlign:"text-top"}}></span>
            <span>本仓库期初库存</span>
            <span style={{width:16,height:16,backgroundColor:"#82ca9d",marginLeft:20,display:"inline-block",marginRight:2,verticalAlign:"text-top"}}></span>
            <span>本仓库期末库存</span>
        </p>
    )
}

class RechartsLineChart extends Component {
    state = {
        activeIndex: 0
    }
    onPieEnter = (data, index) =>{
        this.setState({
            activeIndex: index,
        });
    }
    renderCustomizedLabel1 = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = outerRadius*1.5;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                {percent !== 0 ? this.props.data01[index].name.substring(0,12)+"  " :"其余物料 "}
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    renderCustomizedLabel2 = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = outerRadius*1.5;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} width={60}	dominantBaseline="central">
                {percent !== 0 ? this.props.data02[index].name.substring(0,12)+"  ":"其余物料 "}
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    render () {
        if(this.props.data01.length>0)
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                        onMouseEnter={this.onPieEnter}
                    >
                        <Pie data={this.props.data01} cx={"25%"} cy={200} outerRadius={80} fill="#8884d8" label={this.renderCustomizedLabel1}/>
                        <Pie data={this.props.data02} cx={"75%"} cy={200} outerRadius={80} fill="#82ca9d" label={this.renderCustomizedLabel2}/>
                        <Legend verticalAlign="top" content={renderLegend}/>
                    </PieChart>
                </ResponsiveContainer>
            );
        else{
            return <div></div>
        }

    }

}


export default RechartsLineChart;