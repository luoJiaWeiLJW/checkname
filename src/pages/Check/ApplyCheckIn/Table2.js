/**
 * 与Table1类似,只不过dataSource是全部数据,采用浏览器端分页;
 * 但是后续也要改成服务器端分页的形式,参照Table1的写法
 */
import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm,message} from 'antd';
import ModalForm2 from './ModalForm2';
import axios from 'axios';
import checkCode from '../../../config/codeTips.js';
class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const modalData = {
            materialOrder:{value:"",title:"物料序列编码"},
            producedTaskCode:{value:"",title:"生产任务单号"},
            producedTime:{value:"",title:"生产日期"},
            batchNumber:{value:"",title:"生产批号"},
            materialCode:{value:"",title:"物料编码"},
            name:{value:"",title:"物料名称"},
            standard:{value:"",title:"规格型号"},
            packingId:{value:"",title:"包装"},
            qr:{value:"",title:"质量要求"},
            expirationDate:{value:"",title:"保质期"},
            pack:{value:"",title:"包装名称"},
        };
        const modalType = "";
        const editIndex = -1;
        const dataSource=[];
        const count = 0;
        const modalTitle = "入库申请单项";
        const pagination = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => '共 '+total+' 条'
        };
        const sorter = {
            field: null,
            sorter: null
        }
        const loading = false;
        this.state={visible,dataSource,modalData,count,modalType,editIndex,modalTitle,loading,pagination, sorter,};


    }
    axios = () =>{
        this.setState({loading:true})
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        sortOrder = sortOrder === "ascend" ? "A" : "sortOrder" === "descend" ? "D" : null;
        axios({
            url: '/store/' + this.props.code + '/items',
            method: 'get',
            params: {
                pageindex,
                pagesize,
                sortField,
                sortOrder,
            }
        }).then(res=>{
            if(!checkCode(res.data.code)){
                this.setState({
                    loading:false,
                })
                return
            }
            let dataSource = res.data.data;
            if(dataSource instanceof Array){
                dataSource.map(item => {
                    Object.keys(item).forEach(key => {
                        item[key] = item[key]||""
                    })
                })
            }else{
                dataSource = [];
            }
            this.setState({
                dataSource,
                loading:false,
                pagination: {...this.state.pagination, total: Number(res.data.total)||0}
            })
        }).catch(e=>{
            message.error("系统出错,请重新尝试");
            this.setState({
                loading:false,
            })
        })
    };
    handleTableChange = (pagination, filters, sorter) => {
        const { current, pageSize } = pagination;
        this.setState({
            pagination: {...this.state.pagination, current, pageSize},
            sorter: sorter ? sorter : { field:null, sorter:null }
        },this.axios)
    };
    componentDidMount () {
        this.axios();
    }
    showModal = (type,record) => {
        const modalData = {
            materialOrder:{value:"",title:"物料序列编码"},
            producedTaskCode:{value:"",title:"生产任务单号"},
            producedTime:{value:"",title:"生产日期"},
            batchNumber:{value:"",title:"生产批号"},
            materialCode:{value:"",title:"物料编码"},
            name:{value:"",title:"物料名称"},
            standard:{value:"",title:"规格型号"},
            packingId:{value:"",title:"包装"},
            qr:{value:"",title:"质量要求"},
            expirationDate:{value:"",title:"保质期"},
            pack:{value:"",title:"包装名称"},
        };
        let modalTitle = "入库申请单项";
        if(type == "add"){modalTitle = "新增入库申请单项"}
        this.setState({
            modalType:type,
            visible:true,
            modalData,
            modalTitle
        })        
    }
    onDelete = (record) => {
        axios({
            url:"/store/"+this.props.code+"/item/"+record.id,
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
            this.props.handleChangeTotal(dataSource.length);
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
                    url:"/store/"+this.props.code+"/item",
                    method:"post",
                    data:{
                        materialCode:data.materialCode,
                        materialOrder:data.materialOrder,
                        producedTime:data.producedTime,
                        batchNumber:data.batchNumber,
                        packingId:data.packingId,
                        whId:this.props.whId
                    }
                }).then(res =>{
                    const code = res.data.code;
                    if(code!=="200"&&code!=="201"&&code!=="202"&&code!=="204"){
                        message.warning(res.data.msg||"操作失败")
                        return;
                    }
                    message.success("操作成功")
                    const {dataSource} = this.state;
                    data.id = res.data.data.id||"";
                    this.setState({
                        dataSource:[data,...dataSource]
                    })
                    this.props.handleChangeTotal(dataSource.length+1);
                }).catch(e=>{message.error("系统出错,请重新尝试")})
                
            }

            
        }else{
            const {dataSource,editIndex} = this.state;
            data.id = dataSource[editIndex].id;
            data.status = dataSource[editIndex].status;
            axios({
                url:"/store/"+this.props.code+"/item/"+data.id,
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
        const status = this.props.status;//入库申请单的状态,状态不同,界面功能也不同
        const columns =
            [
                {title:"序号",key:"order",render:(text,record,index) => index+1},
                {title:"生产任务单号",key:"producedTaskCode",dataIndex:"producedTaskCode"},
                {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
                {title:"物料名称",dataIndex:"name",key:"name"},
                {title:"规格型号",dataIndex:"standard",key:"standard"},
                {title:"包装",dataIndex:"pack",key:"pack"},
                {title:"质量要求",dataIndex:"qr",key:"qr"},
                {title:"保质期",dataIndex:"expirationDate",key:"expirationDate"},
                {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder"},
                {title:"生产日期",dataIndex:"producedTime",key:"producedTime"},

            ];
        if(status === "0" || status === "-1"){  //状态 -1 为 提交失败
            columns.push({title:"生产批号",dataIndex:"batchNumber",key:"batchNumber"},);

            columns.push({
                title:"操作",key:"operation",render:(text,record,index)=>{

                    const result = (<span>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button size="small" type="danger" className="table-del-btn">删除</Button>
                        </Popconfirm>
                        </span>
                    )
                    return result;
                }
            })
        }else{
            columns.push({title:"生产批号",dataIndex:"batchNumber",key:"batchNumber"},);
        }
        let result = "";
        if(status === "0" || status === "-1"){ //状态 -1 为提交失败
            result = (
                <div style={{textAlign:"left"}}>
                    <Button  style={{marginTop:5}} onClick={()=>{this.showModal("add")}} type="primary">增加</Button>
                    <Table  size="middle" columns={columns} loading={this.state.loading} onChange={this.handleTableChange} dataSource ={this.state.dataSource} rowKey={record =>record.id} pagination={this.state.pagination}/>
                    <ModalForm2  modalType={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}></ModalForm2>
                </div>
            )
        }
        else{
            result = (
            <div style={{textAlign:"left"}}>
                <Table  size="middle" onChange={this.handleTableChange} columns={columns} loading={this.state.loading} dataSource ={this.state.dataSource}  rowKey={record =>record.id} pagination={this.state.pagination}/>
            </div>
            )
        }    

     
        return result;
        
    }



}
export default Table2;