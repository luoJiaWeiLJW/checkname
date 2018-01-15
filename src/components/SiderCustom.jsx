/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const HOME = (
      <Menu.Item key="1"><Link to="/home"><Icon type="home"/>首页</Link></Menu.Item>
    )
const ADMIN = (
    <SubMenu key="sub1" title={<span><Icon type="laptop"/><span>系统管理</span></span>}>
        <Menu.Item key="2"><Link to="/admin/users"><Icon type="user"/>用户管理</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/admin/organization"><Icon type="team"/>组织机构</Link></Menu.Item>
        <Menu.Item key="4"><Link to="/admin/authorization"><Icon type="idcard"/>权限管理</Link></Menu.Item>
    </SubMenu>
)
class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: ''
    };
    componentDidMount() {
        const _path = this.props.path;
        this.setState({
            openKey: _path.substr(0, _path.lastIndexOf('/')),
            selectedKey: _path
        });
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1]
        })
    };
    render() {
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                onCollapse={this.onCollapse}
                style={{overflowY: 'auto'}}
            >

                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode={this.state.mode}
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={[this.state.openKey]}
                    onOpenChange={this.openMenu}
                >
                    <Menu.Item key="/logo" className="logo">
                        <span><img src="/logo.png" width="40" style={{marginLeft:-3}}/><span className="nav-text" style={{marginLeft:5,marginRight:9}}><img src="/text_logo.png"/></span></span>
                    </Menu.Item>
                    <SubMenu
                        key="/check"
                        title={<span><Icon type="barcode" /><span className="nav-text">单据管理</span></span>}
                    >
                        <Menu.Item key="/check/applyCheckIn"><Link to={'/check/applyCheckIn'}>入库申请单</Link></Menu.Item>
                        <Menu.Item key="/check/checkIn"><Link to={'/check/checkIn'}>入库单</Link></Menu.Item>
                        <Menu.Item key="/check/checkInError"><Link to={'/check/checkInError'}>入库错误信息单</Link></Menu.Item>
                        <Menu.Item key="/check/purApplyCheckIn"><Link to={'/check/purApplyCheckIn'}>采购入库申请单</Link></Menu.Item>
                        <Menu.Item key="/check/purCheckIn"><Link to={'/check/purCheckIn'}>采购入库单</Link></Menu.Item>
                        <Menu.Item key="/check/purCheckInError"><Link to={'/check/purCheckInError'}>采购错误信息单</Link></Menu.Item>
                        <Menu.Item key="/check/applyCheckOut"><Link to={'/check/applyCheckOut'}>出库申请单</Link></Menu.Item>
                        <Menu.Item key="/check/checkOut"><Link to={'/check/checkOut'}>出库单</Link></Menu.Item>
                        <Menu.Item key="/check/SpecifiedCheckOut"><Link to={'/check/SpecifiedCheckOut'}>指定出库单</Link></Menu.Item>
                        <Menu.Item key="/check/checkOutError"><Link to={'/check/checkOutError'}>出库错误信息单</Link></Menu.Item>
                        <Menu.Item key="/check/checkStock"><Link to={'/check/checkStock'}>盘点单</Link></Menu.Item>
                        <Menu.Item key="/check/checkStockProfit"><Link to={'/check/checkStockProfit'}>盘盈单</Link></Menu.Item>
                        <Menu.Item key="/check/checkStockLoss"><Link to={'/check/checkStockLoss'}>盘亏单</Link></Menu.Item>
                        <Menu.Item key="/check/transfer"><Link to={'/check/transfer'}>移库单</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="/statistics"
                        title={<span><Icon type="bar-chart" /><span className="nav-text">统计分析</span></span>}
                    >
                        <Menu.Item key="/statistics/checkStatistics"><Link to={'/statistics/checkStatistics'}>出入库统计表</Link></Menu.Item>
                        <Menu.Item key="/statistics/ageStatistics"><Link to={'/statistics/ageStatistics'}>库存账龄统计表</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/storeManage">
                        <Link to={'/storeManage'}><Icon type="bank" /><span className="nav-text">仓库管理</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/goodsManage">
                        <Link to={'/goodsManage'}><Icon type="database" /><span className="nav-text">物料管理</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/packManage">
                        <Link to={'/packManage'}><Icon type="skin" /><span className="nav-text">包装管理</span></Link>
                    </Menu.Item>
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;