import React, {Component} from 'react';
import Table1 from './Table1';
import {Col,Row,Card} from 'antd';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';


class SpecifiedCheckOut extends Component {

    render () {
        
        
        return <div className="gutter-example">
                <BreadcrumbCustom first="单据管理" second="指定出库单" />
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
    }
}

export default SpecifiedCheckOut;