/**
 * 作者:李凯
 * 时间:2017-10-19   
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route,hashHistory,IndexRedirect } from 'react-router';
import {message} from 'antd';
import Home from './pages/Home';
import Check from './pages/Check'
import ApplyCheckIn from './pages/Check/ApplyCheckIn';
import CheckIn from './pages/Check/CheckIn';
import PurCheckIn from './pages/Check/PurCheckIn';
import PurApplyCheckIn from './pages/Check/PurApplyCheckIn';
import PurCheckInError from './pages/Check/PurCheckInError';
import CheckInError from './pages/Check/CheckInError';
import ApplyCheckOut from './pages/Check/ApplyCheckOut';
import CheckOut from './pages/Check/CheckOut';
import SpecifiedCheckOut from './pages/Check/SpecifiedCheckOut';
import CheckOutError from './pages/Check/CheckOutError';
import CheckStock from './pages/Check/CheckStock';
import CheckStockProfit from './pages/Check/CheckStockProfit';
import CheckStockLoss from './pages/Check/CheckStockLoss';
import Transfer from './pages/Check/Transfer';
import Statistics from './pages/Statistics';
import AgeStatistics from './pages/Statistics/AgeStatistics';
import CheckStatistics from './pages/Statistics/CheckStatistics';
import Admin from './pages/Admin';
import Users from './pages/Admin/Users';
import Organization from './pages/Admin/Organization';
import Authorization from './pages/Admin/Authorization';
import GoodsManage from './pages/GoodsManage';
import PackManage from './pages/PackManage';
import StoreManage from './pages/StoreManage';
import axios from 'axios';

//'/api'用于转发到gateway
axios.defaults.baseURL = '/api';

//刷新cookie,保持会话状态
setInterval(function(){axios.patch("/session/refresh");},360000);

//检查cookie,判断是否为登陆状态
axios({
    url:"/session/checkLogin",
    method:"post",
    withCredentials:true
}).then(res => {
    if(res.data.code == 200){
        if(res.data.data == "-1"){
            message.warning("请先登录");
            window.location.href = "/login.html"
            return;
        }
        ReactDOM.render((
            <Router history={hashHistory}>
                <Route path="/" component={App} key="23" >
                    <IndexRedirect to="/check/applyCheckIn"/>
                    <Route path="home" component={Home} />
                    <Route path="check" component={Check} >
                        <Route path="applyCheckIn" component={ApplyCheckIn}></Route>
                        <Route path="checkIn" component={CheckIn}></Route>
                        <Route path="purApplyCheckIn" component={PurApplyCheckIn}></Route>
                        <Route path="purCheckIn" component={PurCheckIn}></Route>
                        <Route path="purCheckInError" component={PurCheckInError}></Route>
                        <Route path="checkInError" component={CheckInError}></Route>
                        <Route path="applyCheckOut" component={ApplyCheckOut}></Route>
                        <Route path="checkOut" component={CheckOut}></Route>
                        <Route path="SpecifiedCheckOut" component={SpecifiedCheckOut}></Route>
                        <Route path="checkOutError" component={CheckOutError}></Route>
                        <Route path="checkStock" component={CheckStock}></Route>
                        <Route path="checkStockProfit" component={CheckStockProfit}></Route>
                        <Route path="checkStockLoss" component={CheckStockLoss}></Route>
                        <Route path="transfer" component={Transfer}></Route>
                    </Route>
                    <Route path="statistics" component={Statistics}>
                        <Route path="checkStatistics" component={CheckStatistics}></Route>
                        <Route path="ageStatistics" component={AgeStatistics}></Route>
                    </Route>
                    <Route path="admin" component={Admin}>
                        <Route path="users" component={Users}></Route>
                        <Route path="organization" component={Organization}></Route>
                        <Route path="authorization" component={Authorization}></Route>
                    </Route>
                    <Route path="packManage" component={PackManage}></Route>
                    <Route path="storeManage" component={StoreManage}></Route>
                    <Route path="goodsManage" component={GoodsManage}></Route>
                </Route>
            </Router>
        ), document.getElementById('root'));

    }else if(res.data.code == "601"){
        message.warning("登录超时");
        window.location.href = "/login.html"
    }else{
        message.warning("请先登录");
        window.location.href = "/login.html"
    }
}).catch(e =>{
    message.error("系统出错,请重新尝试")
    window.location.href = "/login.html"
})
/*

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App} key="23" >
            <IndexRedirect to="/check/applyCheckIn"/>
            <Route path="home" component={Home} />
            <Route path="check" component={Check} >
                <Route path="applyCheckIn" component={ApplyCheckIn}></Route>
                <Route path="checkIn" component={CheckIn}></Route>
                <Route path="checkInError" component={CheckInError}></Route>
                <Route path="applyCheckOut" component={ApplyCheckOut}></Route>
                <Route path="checkOut" component={CheckOut}></Route>
                <Route path="purApplyCheckIn" component={PurApplyCheckIn}></Route>
                <Route path="purCheckIn" component={PurCheckIn}></Route>
                <Route path="checkOutError" component={CheckOutError}></Route>
                <Route path="checkStock" component={CheckStock}></Route>
                <Route path="checkStockProfit" component={CheckStockProfit}></Route>
                <Route path="checkStockLoss" component={CheckStockLoss}></Route>
            </Route>
            <Route path="statistics" component={Statistics}>
                <Route path="checkStatistics" component={CheckStatistics}></Route>
                <Route path="ageStatistics" component={AgeStatistics}></Route>
            </Route>
            <Route path="admin" component={Admin}>
                <Route path="users" component={Users}></Route>
                <Route path="organization" component={Organization}></Route>
                <Route path="authorization" component={Authorization}></Route>
            </Route>
            <Route path="packManage" component={PackManage}></Route>
            <Route path="storeManage" component={StoreManage}></Route>
            <Route path="goodsManage" component={GoodsManage}></Route>
        </Route>
    </Router>
), document.getElementById('root'));
*/


