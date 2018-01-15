import React, { Component } from 'react';
import './App.css';
import './style/index.less';
import {Layout} from "antd";
import SiderCustom from "./components/SiderCustom";
import HeaderCustom from "./components/HeaderCustom";
const {Content, Footer} = Layout;
class App extends Component {
  state = {
      collapsed: false,
  };
  toggle = () => {
      this.setState({
          collapsed: !this.state.collapsed,
      });
  };
  render() {
    return (
      <Layout className="ant-layout-has-sider">
        <SiderCustom path={this.props.location.pathname} collapsed={this.state.collapsed}/>
        <Layout>
            <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed}/>
            <Content style={{ margin: '0 16px',overflow:"initial" }}>
               {this.props.children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Power Design @2017 Created by Aseit
            </Footer>
        </Layout>
      </Layout>
    
    );
  }
}

export default App;
