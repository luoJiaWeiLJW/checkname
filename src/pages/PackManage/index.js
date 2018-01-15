import React,{Component} from 'react';
import BasicTable from './BasicTable';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class PackManage extends Component{
    render () {
         const columns = [
            {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
            {title:"包装编码",dataIndex:"packingCode",key:"packingCode"},
            {title:"包装名称",dataIndex:"name",key:"name"},
            {title:"规格",dataIndex:"standard",key:"standard"},
            {title:"质量",dataIndex:"quality",key:"quality"},
            {title:"种类",dataIndex:"type",key:"type"},
            {title:"价格(元)",dataIndex:"price",key:"price",sorter:true},
            {title:"长(mm)",dataIndex:"extent",key:"extent"},
            {title:"宽(mm)",dataIndex:"width",key:"width"},
            {title:"高(mm)",dataIndex:"height",key:"height"},
        ];
        const searchKeys = [
            {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
            {title:"包装名称",dataIndex:"name",key:"name"},
        ]    
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="包装管理" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:750}}>
                                <BasicTable searchKeys = {searchKeys} modalTitle = "包装" columns={columns} getUrl="/packings" editUrl="/packing/" addUrl="/packing" delUrl="/packing/"/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
        
            
        
    }


}
export default PackManage; 