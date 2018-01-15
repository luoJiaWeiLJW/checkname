import React, {Component} from 'react';
import { Table,notification, Icon, Button, Popconfirm, message,Input} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";
import ModalForm2 from './ModalForm2';

class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const disableState={
            AddState:false,
            DeleteState:false,
        };
        const modalData = {
            materialOrder:{value:"",title:"物料序列编码"},
            materialName:{value:"",title:"物料名称"},
            materialCode:{value:"",title:"物料编码"},
            batchNumber:{value:"",title:"批号"},
            standard:{value:"",title:"规格型号 "},
            unit:{value:"",title:"单位"},
            packingCode:{value:"",title:"包装"},
            qr:{value:"",title:"质量要求"},
        };
        const modalType = "add";
        const modalKey = '';

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
        };
        const dataSource = [];
        const loading = false;

        this.state = {
          visible,
            disableState,
          modalData,
          modalType,
          modalKey,
          dataSource,
          loading,
          pagination,
          sorter,
        }
    }
    axios = () =>{
        this.setState({loading:true});
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        sortOrder = sortOrder === "ascend" ? "A" : "sortOrder" === "descend" ? "D" : null;
        axios({
            url: '/transfer/' + this.props.id + '/items',
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
                });
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
              loading: false,
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
    componentDidMount(){
        this.axios();
    }

    showModal = (type,record) => {
        //此处只有新增功能所以简写,若有编辑功能时请参照其他Table组件那样写
        this.setState({
            modalType:type,
            visible:true,
        })
    };
    onDelete = (record) => {
        axios({
            url:"/transfer/"+this.props.id+"/item/"+record.id,
            method:"delete",

        }).then(res => {
            if(!checkCode(res.data.code))return;
            this.axios();
        }).catch(e =>{message.error("系统出错,请重新尝试")})
    };
    handleOk = (data) => {
        const {disableState}=this.state;
        disableState.AddState=true;
        this.setState({
            disableState,
            visible: false,
        });
                axios({
                    url:"/transfer/"+this.props.id+"/item",
                    method:"post",
                    data:{
                        transferId:this.props.id,
                        materialOrder:data.materialOrder,
                        materialCode:data.materialCode,
                    }
                }).then(res =>{
                    console.log(res.data.code);
                    if(res.data.code !=="200"&& res.data.code !=="201"&&res.data.code !=="204"){
                        message.warning(res.data.msg||"操作失败");
                        disableState.AddState=false;
                        this.setState({
                            disableState,
                        });
                        return;
                    }
                    message.success("操作成功");
                    disableState.AddState=false;
                    this.setState({
                        disableState,
                    });
                    this.axios()

                }).catch(e=>{
                    message.error("系统出错,请重新尝试");
                    disableState.AddState=false;
                    this.setState({
                        disableState,
                    });
                })
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    render = () => {
        const columns = [
            {title:"序号",key:"order",render:(text,record,index) => index+1},
            {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
            {title:"物料名称",dataIndex:"metarialName",key:"materialName"},
            {title:"物料序列编码",dataIndex:"materialOrder",key:"materiaOrder"},
            {title:"批号",dataIndex:"batchNumber",key:"batchNumber"},
            {title:"规格型号",dataIndex:"standard",key:"standard"},
            {title:"单位",dataIndex:"unit",key:"unit"},
            {title:"包装",dataIndex:"packingCode",key:"packingCode"},
            {title:"质量要求",dataIndex:"qr",key:"qr"},
        ];
        const {custom}=this.props;
        const AddState=this.state.disableState.AddState;
        if(this.props.state === "0"&&this.props.custom==="1"){
            columns.push({
                title:"操作",key:"operation",render:(text,record)=>{
                    return(
                        <span>
                          <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                              <Button size="small" type="danger" className="table-del-btn">删除</Button>
                          </Popconfirm>
                        </span>)

                }
            })
        }
        if(this.props.state === "0"){
            return (
                <div style={{textAlign:'left'}}>
                    {custom==="1"?<div style={{ marginTop:10}}>
                        <Button type="primary" disabled={AddState}  onClick={() => this.showModal("add")} >增加</Button>
                    </div>:null}
                    <Table size="middle" columns={columns} dataSource ={this.state.dataSource} rowKey={record=>record.id} loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange}/>
                    <ModalForm2  modalType={this.state.modalType}  visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}></ModalForm2>
                </div>

            )
        }else{
            return(
                <div style={{textAlign:"left"}}>
                    <Table columns={columns} loading={this.state.loading} size="middle" onChange={this.handleTableChange} dataSource ={this.state.dataSource} rowKey={record=>record.id} pagination={this.state.pagination} />
                </div>
            )
        }




    }



}
export default Table2;