import React, {Component} from 'react';
import {Button,Table,Modal} from 'antd';

class ModalForm2 extends Component{

    render () {
        const columns = [
            {title:"货品编码",dataIndex:"materialCode",key:"code"},
            {title:"序列编码",dataIndex:"materialOrder",key:"materialOrder"},
            {title:"货品名称",dataIndex:"material.name",key:"name"},
            {title:"型号规格",dataIndex:"material.standard",key:"standard"},
            {title:"包装",dataIndex:"packing.name",key:"packingName"},
            {title:"生产日期",dataIndex:"producedTime",key:"producedTime"},
            {title:"保质期",dataIndex:"material.expirationDate",key:"expirationDate"},
            {title:"存品批号",dataIndex:"batchNumber",key:"batchNumber"},
            {title:"质量要求",dataIndex:"material.qr",key:"qr"}
        ]
        return (
            <Modal visible={this.props.visible} title={this.props.title} onCancel={this.props.onCancel} onOk={this.props.onOk} okText="打印" width="1000px" footer={null}>
                <Table columns={columns} dataSource={this.props.dataSource}/>
            </Modal>
        )
    }
}

export default ModalForm2