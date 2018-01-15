import React, {Component} from 'react';
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';


class ApplyCheckIn extends Component {

    render () {
        const columns = [
            {title:"制单日期",dataIndex:"createTime",key:"createTime"},
            {title:"单据编号",dataIndex:"code",key:"code"},
            {title:"转移部门",dataIndex:"groupName",key:"groupName"},
            {title:"转移人员",dataIndex:"userName",key:"userName"},
            {title:"转移仓库",dataIndex:"whName",key:"whName"},
            {title:"原存储位置",dataIndex:"sourceCode",key:"sourceCode"},
            {title:"需转移存储位置",dataIndex:"targetCode",key:"targetCode"},
            {title:"状态",dataIndex:"state",key:"state",render:text =>{
                if(text === "0"){return "未执行"}
                if(text === "1"){return "已执行"}
            }}
        
        ]
        
        return (<div className="gutter-example">
                <BreadcrumbCustom  first="单据管理" second="移库单"  />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:750}}>
                                <Table1 columns = {columns}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
            )
    }
}

export default ApplyCheckIn;