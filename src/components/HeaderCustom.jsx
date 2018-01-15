/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Menu, Icon, Layout, Tooltip,message } from 'antd';
import axios from "axios";
import screenfull from 'screenfull';
//import { gitOauthToken, gitOauthInfo } from '../axios';
//import { queryString } from '../utils';
import avater from '../style/imgs/b1.jpg';


const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    state = {
        empName:"姓名",
        groupName:"部门",
        lastLoginTime:"",
    };
    componentDidMount (){
        axios.get("/session/loginInfo")
            .then(res => {
                if(res.data.code !="200"){
                    message.warning("获取用户信息失败")
                }else{
                    const {empName,groupName,lastLoginTime}=res.data.data;
                    this.setState({empName,groupName,lastLoginTime})
                }
            }).catch(e => {message.error("系统出错,请重新尝试")})
    }
    handleExit = ()=>{
        axios({
            url:"/session",
            method:"delete",
            withCredentials:true
        }).then(res=>{
            if(res.data.code =="200"){
                window.location.href ="/login.html";
            }else{
                var expires = new Date(0).toUTCString();
                document.cookie = "sessionId=;expires="+expires+";path=/";
                window.location.href = "/login.html"
            }
        }).catch(e =>{
            message.error("系统出错,请重新尝试")
        })

    }
    /*componentDidMount() {
        const QueryString = queryString();
        // if (QueryString.hasOwnProperty('code')) {
        //
        //     const _user = JSON.parse(localStorage.getItem('user'));
        //     !_user && gitOauthToken(QueryString.code).then(res => {
        //
        //         gitOauthInfo(res.access_token).then(info => {
        //             this.setState({
        //                 user: info
        //             });
        //             localStorage.setItem('user', JSON.stringify(info));
        //         });
        //     });
        //     _user && this.setState({
        //         user: _user
        //     });
        // }
        const _user = JSON.parse(localStorage.getItem('user')) || '测试';
        if (!_user && QueryString.hasOwnProperty('code')) {
            gitOauthToken(QueryString.code).then(res => {
                gitOauthInfo(res.access_token).then(info => {
                    this.setState({
                        user: info
                    });
                    localStorage.setItem('user', JSON.stringify(info));
                });
            });
        } else {
            this.setState({
                user: _user
            });
        }
    };*/
    screenFull = () => {
      screenfull.toggle();
    };
    render() {
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                <Icon
                    className="trigger custom-trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <span style={{fontSize:18,fontWeight:"bolder"}}>松堡仓储管理系统</span>
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                    <Menu.Item key="full">
                        <Tooltip title="全屏切换" placement="left" mouseLeaveDelay={0}>
                        <div style={{position:"absolute",width:70,height:65,left:0,top:0}}  onClick={this.screenFull} >
                        </div>
                        </Tooltip>
                        <Icon type="arrows-alt"/>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <Tooltip title="登出" placement="left" mouseLeaveDelay={0}>
                        <div style={{position:"absolute",width:76,height:65,left:0,top:0}}  onClick={this.handleExit} >
                        </div>
                        </Tooltip>
                        <Icon type="poweroff"/>
                    </Menu.Item>
                    <SubMenu className="nameMenu" title={<span >{this.state.empName}</span>}>
                        <Menu.Item key="setting:1">{this.state.groupName}</Menu.Item>
                        <Menu.Item key="setting:2">设置</Menu.Item>
                        <Menu.Item key="setting:3"><Tooltip title={"上次登录时间为 "+this.state.lastLoginTime} placement="leftBottom">登录时间</Tooltip></Menu.Item>
                    </SubMenu>
                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -45px;
                        text-align:center
                    }
                    .ant-menu-submenu-horizontal >.ant-menu-item{
                        width: 65px
                    }
                    .nameMenu{
                        min-width:80px;
                        text-align:center
                    }
                    .nameMenu .ant-menu{
                    }
                `}</style>
            </Header>
        )
    }
}

export default HeaderCustom;