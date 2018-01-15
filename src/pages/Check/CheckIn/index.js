import React, {Component} from 'react';
import './CheckIn.css'
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';

class CheckIn extends Component{
    constructor(props){
        super(props);
        const columns = [
            {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate",sorter:true,width:"10%"},
            {title:"单据编号",dataIndex:"intoCode",key:"intoCode",width:"15%"},
            {title:"车牌号",dataIndex:"carNumber",key:"carNumber",width:"8%"},
            {title:"交货部门",dataIndex:"provideGroupName",key:"provideGroupName",width:"8%"},
            {title:"交货人员",dataIndex:"provideUserName",key:"provideUserName",width:"11%"},
            {title:"收货仓库",dataIndex:"warehouseName",key:"warehouseName",width:"11%"},
            {title:"收货人员",dataIndex:"consigneeUserName",key:"consigneeUserName",width:"6%"},
            {title:"物流公司",dataIndex:"logisticsCompany",key:"logisticsCompany",width:"8%"}
        ]
    
        this.columns=columns;
    }

    render () {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="入库单" />
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