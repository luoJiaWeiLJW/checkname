import React, {Component} from 'react';
import './CheckIn.css'
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';


class CheckIn extends Component{
    constructor(props){
        super(props);
        const columns = [
            {title:"制单日期",dataIndex:"createTime",key:"createTime",sorter:true},
            {title:"单据编号",dataIndex:"code",key:"code"},
            {title:"入库单编号",dataIndex:"sourceCode",key:"sourceCode"},
            {title:"车牌号",dataIndex:"store.carNumber",key:"carNumber"},
            {title:"交货部门",dataIndex:"store.provideGroupName",key:"postcode"},
            {title:"交货人员",dataIndex:"store.provideUserName",key:"predictDeliverTime"},
            {title:"收货仓库",dataIndex:"store.warehouseName",key:"logisticsType",},
            {title:"收货人员",dataIndex:"store.consigneeUserName",key:"consigneeUserName",},
            {title:"物流公司",dataIndex:"store.logisticsCompany",key:"logisticsCompany",},
        ]
        this.columns=columns;
    }

    
    render () {
        
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="入库错误信息单" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:750}}>
                                <Table1 columns = {this.columns} />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
        
    }



}
export default CheckIn;