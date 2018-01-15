import React, {Component} from 'react';
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';


class CheckIn extends Component{
    constructor(props){
        super(props);
        const columns = [
            {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate",sorter:true},
            {title:"单据编号",dataIndex:"outCode",key:"outCode"},
            {title:"出库时间",dataIndex:"outDate",key:"outDate"},
            {title:"发货通知单号",dataIndex:"noticeNo",key:"noticeNo"},
            {title:"购货单位",dataIndex:"name",key:"name"},
            {title:"销售业务员",dataIndex:"salesman",key:"salesman"},
            {title:"地址",dataIndex:"address",key:"address"},
            {title:"负责人",dataIndex:"principalName",key:"principalName"},
            {title:"负责人电话",dataIndex:"principalPhone",key:"principalPhone"},
            {title:"邮编",dataIndex:"postcode",key:"postcode"},
            {title:"预计发货时间",dataIndex:"predictDeliverTime",key:"predictDeliverTime",sorter:true},
            {title:"出货仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"总数量",dataIndex:"goodsCount",key:"goodsCount"},
            {title:"物流方式",dataIndex:"logisticsType",key:"logisticsType"},
            {title:"物流公司",dataIndex:"logisticsCompany",key:"logisticsCompany"},
            {title:"制单部门",dataIndex:"outGroupName",key:"outGroupId"},
            {title:"制单人",dataIndex:"outUserName",key:"outUserId"},
        ]
        this.columns=columns;
    }

    
    render () {
        
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="出库单" />
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