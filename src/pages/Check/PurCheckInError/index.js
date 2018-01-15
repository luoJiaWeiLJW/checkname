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
            {title:"采购单编号",dataIndex:"purchase.purchaseCode",key:"purchaseCode"},
            {title:"供应商",dataIndex:"purchase.supplier",key:"supplier"},
            {title:"收货仓库",dataIndex:"purchase.warehouseName",key:"warehouseName"},
            {title:"收货部门",dataIndex:"purchase.consigneeGroupName",key:"consigneeGroupName"},
            {title:"收货人员",dataIndex:"purchase.consigneeUserName",key:"consigneeUserName"},
        ]
        this.columns=columns;
    }

    
    render () {
        
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="采购错误信息单" />
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