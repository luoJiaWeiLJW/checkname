import React, {Component} from 'react';
import Table1 from './Table1';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import {Row,Col,Card} from 'antd';
class ApplyCheckIn extends Component {

    render () {
        
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="盘亏单" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:750}}>
                                <Table1/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}

export default ApplyCheckIn;