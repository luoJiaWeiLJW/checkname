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
            {title:"单据编号",dataIndex:"code",key:"code"},
            {title:"出库单编号",dataIndex:"sourceCode",key:"sourceCode"},
            {title:"出库时间",dataIndex:"outDate",key:"outDate"},
            {title:"购货单位",dataIndex:"name",key:"name"},
            {title:"地址",dataIndex:"address",key:"address"},
            {title:"负责人姓名",dataIndex:"principalName",key:"principalName"},
            {title:"负责人电话",dataIndex:"principalPhone",key:"principalPhone"},
            {title:"邮编",dataIndex:"postcode",key:"postcode"},
            {title:"预计发货时间",dataIndex:"predictDeliverTime",key:"predictDeliverTime",sorter:true,},
            {title:"出货仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"物流方式",dataIndex:"logisticsType",key:"logisticsType",},
            {title:"物流公司",dataIndex:"logisticsCompany",key:"logisticsCompany",},
            {title:"制单部门",dataIndex:"outGroupName",key:"outGroupId",},
            {title:"制单人",dataIndex:"outUserName",key:"outUserId",},
        ]
        this.columns=columns;
    }

    
    render () {
        
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="出库错误信息单" />
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