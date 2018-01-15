import React, {Component} from 'react';
import './CheckIn.css'
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';

class CheckIn extends Component{
    constructor(props){
        super(props);
        const columns = [
            {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate",sorter:true},
            {title:"单据编号",dataIndex:"purchaseCode",key:"purchaseCode"},
            {title:"送货单号",dataIndex:"deliveryNumber",key:"deliveryNumber"},
            {title:"供应商",dataIndex:"supplier",key:"supplier"},
            {title:"收货仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"收货部门",dataIndex:"consigneeGroupName",key:"consigneeGroupName"},
             {title:"收货人员",dataIndex:"consigneeUserName",key:"consigneeUserName"},
        ]
    
        this.columns=columns;
    }

    render () {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="采购入库单" />
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