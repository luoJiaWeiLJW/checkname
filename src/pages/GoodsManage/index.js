import React,{Component} from 'react';
import BasicTable from '../../components/BasicTable';
import {Row,Col,Card} from 'antd';
import BreadcrumbCustom from '../../components/BreadcrumbCustom';
class GoodsManage extends Component{
    render () {
        const columns = [
            {title:"物料名称",dataIndex:"name",key:"name"},
            {title:"物料编码",dataIndex:"code",key:"code"},
            {title:"型号规格",dataIndex:"standard",key:"standard"},
            {title:"类别",dataIndex:"type",key:"type",render:text =>{
                if(text == "1"){return "成品仓"}
                if(text == "2"){return "饰品仓"}
                if(text == "3"){return "木材仓"}
                if(text == "4"){return "五金仓"}
                return ""
            }},
            {title:"计量单位",dataIndex:"unit",key:"unit"},
            {title:"计量子单位",dataIndex:"subUnit",key:"subUnit"},
            {title:"制造单位",dataIndex:"makeCompany",key:"makeCompany"},
            {title:"供货单位",dataIndex:"supplier",key:"supplier"},
            {title:"保质期",dataIndex:"expirationDate",key:"expirationDate",sorter:true},
            {title:"质量要求",dataIndex:"qr",key:"qr"},            
            {title:"存放要求",dataIndex:"storage",key:"storage"},                       
        ];
        const searchKeys = [
            {title:"物料名称",dataIndex:"name",key:"name"},
            {title:"供货单位",dataIndex:"supplier",key:"supplier",sorter:true},
        ]
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="物料管理" />
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:750}}>
                                <BasicTable searchKeys={searchKeys} modalTitle="物料" columns={columns} getUrl="/materials" editUrl="/material/" delUrl="/material/" addUrl="/material"/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        ) 
            
        
    }

}
export default GoodsManage;