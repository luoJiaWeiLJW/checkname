import React, {Component} from 'react';
import Table1 from './Table1';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../components/BreadcrumbCustom';


class ApplyCheckIn extends Component {

    render () {
        const columns = [
            {title:"仓库名称",dataIndex:"name",key:"name"},
            {title:"仓库编号",dataIndex:"code",key:"code"},
            {title:"容量(m³)",dataIndex:"capacity",key:"capacity"},
            {title:"管理要求",dataIndex:"managementDemand",key:"managementDemand"},
            {title:"负责人",dataIndex:"managerId",key:"managerId"},
            {title:"仓库类型",dataIndex:"type",key:"type",render:(text,record,index) =>{
                if(text == "1"){return "成品仓"}
                if(text == "2"){return "饰品仓"}
                if(text == "3"){return "木材仓"}
                if(text == "4"){return "五金仓"}
                return ""
            }}
        
        ]
        
        return (<div className="gutter-example">
                <BreadcrumbCustom first="仓库管理"  />
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