import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm,message} from 'antd';
import ModalTable from './ModalTable';
import axios from 'axios';
import checkCode from '../../../config/codeTips.js';
class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const modalData = [];
        const dataSource=[];
        const loading = false;
        this.state={visible,dataSource,modalData,loading};
        //初始化columns
        const columns =
            [
                {title:"货品编码",dataIndex:"material.code",key:"code"},
                {title:"货品名称",dataIndex:"material.name",key:"name"},
                {title:"型号规格",dataIndex:"material.standard",key:"standard"},
                {title:"包装",dataIndex:"packing.name",key:"packingName"},
                {title:"质量要求",dataIndex:"material.qr",key:"qr"},
                {title:"保质期",dataIndex:"material.expirationDate",key:"expirationDate"},
                {title:"单位",dataIndex:"material.unit",key:"batchNumber0"},
                {title:"账存数量",dataIndex:"inventoryNum",key:"amount"},
                {title:"盘点数量",dataIndex:"takeStockNum",key:"takeStockNum"},
                {title:"数量差值",dataIndex:"diffNum",key:"diffNum"},
            ];

        columns.push({
        title:"操作",key:"operation",render:(text,record)=>{
            const result = <span><Button size="small" type="primary" onClick={()=>{this.showModal(record)}}>查看详情</Button></span>;
            return result;
        }
        })

        this.columns = columns;

    }
    componentDidMount () {
        this.setState({loading:true})
        axios({
            url:"/stat/takestock/"+this.props.code+"/type/lose",
            method:"get"
        })
            .then(res =>{

                if(!checkCode(res.data.code)){
                    this.setState({
                        loading:false,
                        dataSource:[]
                    })
                    return;
                }
                const dataSource = res.data.data;
                if(dataSource instanceof Array){
                    dataSource.map(item => {
                        Object.keys(item).forEach(key => {
                            if(!item[key]&&item[key]!==0){
                                item[key] = ""
                            }
                        })
                    })
                    this.setState({dataSource,count:dataSource.length,loading:false});
                }else{
                    this.setState({dataSource:[],count:0,loading:false})
                }
            }).catch(e=>{
                this.setState({
                    loading:false
                })
                message.error("系统出错,请重新尝试")
            })
    }
    showModal = (record) => {
        this.setState({visible:true})
        axios({
            url:"/stat/takestock/"+this.props.code+"/type/lose/material_code/"+record.material.code+"/goods"
        }).then(res =>{
            if(!checkCode(res.data.code)){
                this.setState({
                    modalData:[]
                })
                return;
            }
            if(res.data.data instanceof Array){
                this.setState({modalData:res.data.data})
            }else{
                this.setState({modalData:[]})
            }
        }).catch(e =>{message.error("系统出错,请重新尝试")})
    }

    handleOk = () => {
   
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render = ()=> {
        const status = this.props.status;
        let  result = (
            <div style={{textAlign:"left"}}>
                <Table columns={this.columns} loading={this.state.loading} dataSource ={this.state.dataSource} />
                <ModalTable title="盘亏货品列表" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} dataSource={this.state.modalData}/>
            </div>
         )


        return result;

    }




    newFunction() {
        window.print();
    }

    newFunction_1() {
        this.newFunction();
    }
}
export default Table2;