import React, {Component} from 'react';
import {message, Table, Menu, Icon, Button, Popconfirm} from 'antd';
import ModalForm2 from './ModalForm2'
import axios from 'axios';
import checkCode from '../../../config/codeTips';
class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const modalData = {
            materialOrder:{value:"",title:"序列编码"},//
            materialCode:{value:"",title:"产品编码"},//
            productName:{value:"",title:"产品名称"},//
            batchNumber:{value:"",title:"批号"},//
            standard:{value:"",title:"规格型号"},//
            unit:{value:"",title:"单位"},//
            packingCode:{value:"",title:"包装"},
            whLocationCode:{value:"",title:"库位"},//
            quality:{value:"",title:"质量要求"},//
            purpose:{value:"",title:"出库用途"},
        };
        const modalkey = "";
        const modalType = "";
        const editIndex = -1;
        const dataSource=[];
        const count = 0;
        const modalTitle = "出库单项";
        const loading = false;
        this.state={visible,dataSource,modalData,count,modalType,editIndex,modalkey,modalTitle,loading};

    }
    axios=()=>{
        this.setState({loading:true});
        axios.get("/specific/code/"+this.props.code+"/items")
            .then(res =>{
                if(!checkCode(res.data.code)){
                    this.setState({
                        dataSource:[],
                        loading:false
                    });
                    return;
                }
                let dataSource = res.data.data;
                if(dataSource instanceof Array){
                    dataSource.map(item => {
                        Object.keys(item).forEach(key => {
                            item[key] = item[key]||""
                        })
                    })
                }else{
                    dataSource=[]
                }
                this.setState({dataSource,loading:false});
                this.props.handleChangeTotal(dataSource.length);
            }).catch(e=>{message.error("系统出错,请重新尝试")})
    };
    componentDidMount () {
        this.axios();
    }
    onDelete = (record) =>{
        axios({
            url:"/specific/code/"+this.props.code+"/item/"+record.id,
            method:"delete",

        }).then(res =>{
            if(!checkCode(res.data.code)){ return }
            const dataSource = [...this.state.dataSource];
            let i = -1;
            this.state.dataSource.forEach((item,index) =>{
                if(item === record){i = index}
            });
            dataSource.splice(i, 1);
            this.setState({ dataSource});
            this.props.handleChangeTotal(dataSource.length);
        }).catch(e =>{message.error("系统出错,请重新尝试")})
    };
    showModal = (type,record) => {
        const modalData = {
            materialOrder:{value:"",title:"序列编码"},
            materialCode:{value:"",title:"产品编码"},
            productName:{value:"",title:"产品名称"},
            batchNumber:{value:"",title:"批号"},
            standard:{value:"",title:"规格型号"},
            unit:{value:"",title:"单位"},
            packingCode:{value:"",title:"包装"},
            whLocationCode:{value:"",title:"库位"},
            quality:{value:"",title:"质量要求"},
            purpose:{value:"",title:"出库用途"},
        };

        if(type == "edit"){

            Object.keys(modalData).forEach(key =>{
                modalData[key].value = record[key];
            })
        }


        let editIndex = -1;
        this.state.dataSource.forEach((item,index)=>{
            if(item === record){editIndex = index}
        });
        let modalTitle = "";
        if(type == "add") modalTitle = "新增出库单项";
        if(type == "edit") modalTitle = "修改出库单项";

        let modalkey = "";
        if(type == "add"){
            modalkey ="add"
        }
        if(type == "edit"){
            modalkey = record.id
        }
        this.setState({
            modalType:type,
            editIndex:editIndex,
            visible:true,
            modalData:modalData,
            modalkey,
            modalTitle
        })
    };
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            let repeat = false;
            this.state.dataSource.forEach(item=>{
                if(item.materialOrder == data.materialOrder){
                    repeat = true;
                    message.warning("请不要重复添加同一类货品")
                }
            });
            if(!repeat){
                axios({
                    url:"/specific/code/"+this.props.code+"/item",
                    method:"post",
                    data:{
                        purpose:data.purpose,
                        materialCode:data.materialCode,
                        materialOrder:data.materialOrder
                    }
                }).then(res =>{
                    if(res.data.code !=="200" && res.data.code !=="201" && res.data.code !== "204"){
                        message.warning(res.data.msg || "操作失败")
                        return;
                    }
                    const {dataSource} = this.state;
                    data.id = res.data.data.id||"";
                    this.setState({
                        dataSource:[data,...dataSource]
                    },this.axios());
                    this.props.handleChangeTotal(dataSource.length+1);
                }).catch(e=>{message.error("系统出错,请重新尝试")})
            }

        }else{
            const {dataSource,editIndex} = this.state;
            data.id = dataSource[editIndex].id;
            data.status = dataSource[editIndex].status;
            axios({
                url:"/specific/code/"+this.props.code+"/item/"+data.id,
                method:"put",
                data:{
                    purpose:data.purpose,
                    materialCode:data.materialCode,
                    materialOrder:data.materialOrder
                }
            }).then((res)=>{
                if(!checkCode(res.data.code)){return}
                dataSource[editIndex] = data;
                this.setState({
                    dataSource
                },this.axios())
            }).catch(e=>{message.error("系统出错,请重新尝试")})
        }
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    render = ()=> {
        const status = this.props.status;
        const columns = [
            {title:"序号",key:"order",render:(text,record,index) => index+1},
            {title:"产品编码",dataIndex:"materialCode",key:"materialCode"},
            {title:"产品名称",dataIndex:"productName",key:"productName"},
            {title:"序列编码",dataIndex:"materialOrder",key:"materialOrder"},
            {title:"批号",dataIndex:"batchNumber",key:"batchNumber"},
            {title:"规格型号",dataIndex:"standard",key:"standard"},
            {title:"单位",dataIndex:"unit",key:"unit"},
            {title:"包装",dataIndex:"packingCode",key:"packingCode"},
            {title:"库位",dataIndex:"whLocationCode",key:"whLocationCode"},
            {title:"质量要求",dataIndex:"quality",key:"quality"},
            {title:"出库用途",dataIndex:"purpose",key:"purpose"},
        ];
        if(status === "0"){
            columns.push({
                title:"操作",key:"operation",render:(text,record,index)=>{
                    return (
                        <span>
                            <Button size="small" type="primary" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                                <Button size="small" type="danger" className="table-del-btn">删除</Button>
                            </Popconfirm>
                        </span>
                    )
                }
            })
        }
        let result = (
            <div style={{textAlign:"left"}}>
                <Button  style={{marginTop:5}} type="primary" onClick={()=>{this.showModal("add")}}>增加</Button>
                <Table size="middle" columns={columns} dataSource ={this.state.dataSource} rowKey={record=>record.id} loading={this.state.loading}/>
                <ModalForm2 key={this.state.modalkey} title = {this.state.modalTitle} modalType={this.state.modalType}
                            visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}/>
            </div>
        );
        if(status !== "0"){
            result = (
            <div style={{textAlign:"left"}}>
                <Table size="middle" columns={columns} dataSource ={this.state.dataSource} loading={this.state.loading} rowKey={record=>record.id} expandedRowRender={this.props.expandedRowRender}/>
            </div>
            )
        }
        return result;
    }
}
export default Table2;