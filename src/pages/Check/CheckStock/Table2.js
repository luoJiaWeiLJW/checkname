import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm,message} from 'antd';
import axios from 'axios';
import checkCode from '../../../config/codeTips.js';
class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const modalData = {
            materialCode:"",
            name:"",
            standard:"",
            packId:"",
            qr:"",
            expirationDate:"",
            pack:"",
            materialOrder:"",
            producedTime:"",
            batchNumber:""
        };
        const modalType = "";
        const editIndex = -1;
        const dataSource=[];
        const count = 0;
        const modalTitle = "入库申请单项";
        const loading = false;
        this.state={visible,dataSource,modalData,count,modalType,editIndex,modalTitle,loading};
        //初始化columns
        const columns = 
        [
            {title:"物料编码",dataIndex:"material.code",key:"code"},
            {title:"物料名称",dataIndex:"material.name",key:"name"},
            {title:"型号规格",dataIndex:"material.standard",key:"standard"},
            {title:"包装",dataIndex:"packing.name",key:"packingName"},
            {title:"质量要求",dataIndex:"material.qr",key:"qr"},
            {title:"保质期",dataIndex:"material.expirationDate",key:"expirationDate"},
            {title:"子单位",dataIndex:"material.subUnit",key:"subUnit"},
            {title:"账存数量",dataIndex:"inventoryNum",key:"amount"},
            {title:"盘点数量",dataIndex:"takeStockNum",key:"takeStockNum"},
            {title:"数量差值",dataIndex:"diffNum",key:"diffNum"},
        ];
        this.columns = columns;

    }
    componentDidMount () {
        this.setState({loading:true})
        axios({
            url:"/stat/takestock/item/"+this.props.code+"/goods",
            method:'get'
        }).then(res =>{
                
                if(!checkCode(res.data.code)){
                    this.setState({
                        loading:false
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
    showModal = (type,record) => {
        const modalData = {
            materialCode:"",
            hiddenCode:"",
            name:"",
            standard:"",
            packId:"",
            qr:"",
            expirationDate:"",
            pack:"",
            materialOrder:"",
            producedTime:"",
            batchNumber:"",
            
        };
        this.columns.map((item)=>{
            if(item.dataIndex){
                const value = (typeof record !== 'undefined')? record[item.dataIndex] :"";
                const title = item.title;
                modalData[item.dataIndex]={value,title};
            }
        })
        if(type == "edit"){
            modalData["packId"]={value:record.packId||"",title:"包装"};
            modalData["hiddenCode"]={value:record.materialCode||""};
            modalData["materialCode"]={value:record.materialCode+"("+record.name+")",title:"物料"}
        }if(type == "add"){
            modalData["packId"]={value:"",title:"包装"}
        }
        let editIndex = -1;
        this.state.dataSource.forEach((item,index) =>{
            if(item === record){editIndex = index}
        })
        let modalTitle = "入库申请单项";
        if(type == "add"){modalTitle = "新增入库申请单项"}
        if(type == "edit"){modalTitle = "修改入库申请单项"}
        this.setState({
            modalType:type,
            editIndex:editIndex,
            visible:true,
            modalData
        })        
    }
    onDelete = (record) => {
        axios({
            url:"/stat/store/"+this.props.code+"/item/"+record.id,
            method:"delete",
            
        }).then(res => {
            if(!checkCode(res.data.code))return;
            const dataSource = [...this.state.dataSource];
            let i = -1;
            this.state.dataSource.forEach((item,index) =>{
                if(item === record){i = index}
            })     
            dataSource.splice(i, 1);
            this.setState({ dataSource});
        }).catch(e =>{message.error("系统出错,请重新尝试")})   
    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            let repeat = false;
            this.state.dataSource.forEach(item =>{
                if(item.materialOrder == data.materialOrder){
                    message.warning("请不要重复提交同一件货品")
                    repeat = true;
                }
            })
            if(!repeat){
                
                axios({
                    url:"/stat/store/"+this.props.code+"/item",
                    method:"post",
                    data:{
                        materialCode:data.materialCode,
                        materialOrder:data.materialOrder,
                        producedTime:data.producedTime,
                        batchNumber:data.batchNumber
                    }
                }).then(res =>{
                    const {dataSource} = this.state;
                    data.id = res.data.data.id||"";
                    this.setState({
                        dataSource:[data,...dataSource]
                    })
                }).catch(e=>{message.error("系统出错,请重新尝试")})
                
            }

            
        }else{
            const {dataSource,editIndex} = this.state;
            data.id = dataSource[editIndex].id;
            data.status = dataSource[editIndex].status;
            axios({
                url:"/stat/store/"+this.props.code+"/item/"+data.id,
                method:"put",
                data:{
                    ...data
                }
            }).then((res)=>{
                if(!checkCode(res.data.code)){return}
                dataSource[editIndex] = data;
                this.setState({
                    dataSource
                })
            }).catch(e=>{message.error("系统出错,请重新尝试")})

        }

    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render = ()=> {
        let  result = (
            <div style={{textAlign:"left"}}>
                <Table size="middle" columns={this.columns} loading={this.state.loading} dataSource ={this.state.dataSource} rowKey={record=>record.goodId}/>
            </div>
        )
        return result;
        
    }



}
export default Table2;