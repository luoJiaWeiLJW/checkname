import React, {Component} from 'react';
import { Table,notification, Icon, Button, Popconfirm, message,Input} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";
import ModalForm2 from './ModalForm2';

class Table2 extends Component{
    constructor(props){
        super(props);

        const visible = false;
        const modalData = {
          materialOrder:{value:"",title:"物料序列编码"},
          materialCode:{value:"",title:"物料编码"},
          materialName:{value:"",title:"物料名称"},
          orderNo:{value:"",title:"采购订单单号"},
          deliveryNoteNo:{value:"",title:"送货单号"},
        };
        const modalType = "add";
        const modalKey = '';
        const selectedRowKeys=[];
        const selectedRows = [];
        const pagination = {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => '共 '+total+' 条'
        }
        const sorter = {
            field: null,
            sorter: null
        }
        const dataSource = [];
        const loading = false;
        const code = '';//待分配的库位编号
        this.state = {
          visible,
          modalData,
          modalType,
          modalKey,
          dataSource,
          loading,
          pagination,
          sorter,
          selectedRowKeys,
          selectedRows,
          code,
        }
    }
    axios = () =>{
        this.setState({loading:true})
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        sortOrder = sortOrder === "ascend" ? "A" : "sortOrder" === "descend" ? "D" : null;
        axios({
            url: '/purchase/' + this.props.code + '/items',
            method: 'get',
            params: {
              pageindex,
              pagesize,
              sortField,
              sortOrder,
            }
        }).then(res=>{
            console.log(res.data.data,'批次号')
            if(!checkCode(res.data.code)){
                this.setState({
                    loading:false,
                })
                return
            }
            const selectedRows = [];
            const selectedRowKeys = [];
            res.data.data.forEach(item => {
                if(item.whLocationCode){
                    selectedRows.push(item);
                    selectedRowKeys.push(item.id);
                }
            })
            this.setState({
              dataSource: res.data.data || [],
              loading: false,
              pagination: {...this.state.pagination, total: Number(res.data.total)||0},
              selectedRows,
              selectedRowKeys,
            })
                
        }).catch(e=>{
            message.error("系统出错,请重新尝试");
            this.setState({
                loading:false,
            })
        })
    }
    handleTableChange = (pagination, filters, sorter) => {
      const { current, pageSize } = pagination;
      this.setState({
          pagination: {...this.state.pagination, current, pageSize},
          sorter: sorter ? sorter : { field:null, sorter:null }
      },this.axios)
    }
    componentDidMount(){
        this.axios();
    }

    showModal = (type,record) => {
        //此处只有新增功能所以简写,若有编辑功能时请参照其他表格那样写
        this.setState({
            modalType:type,
            visible:true,
        })
    }
    onDelete = (record) => {
        axios({
            url:"/purchase/"+this.props.code+"/item/"+record.id,
            method:"delete",

        }).then(res => {
            if(!checkCode(res.data.code))return;
            this.axios()
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
                    url:"/purchase/"+this.props.code+"/item",
                    method:"post",
                    data:{
                        materialOrder:data.materialOrder,
                        materialCode:data.materialCode,
                        orderNo:data.orderNo,
                        deliveryNoteNo:data.deliveryNoteNo,

                    }
                }).then(res =>{
                    if(res.data.code !=="200"&& res.data.code !=="201"&&res.data.code !=="204"){
                        message.warning(res.data.msg||"操作失败")
                        return;
                    }
                    message.success("操作成功")
                    this.axios()

                }).catch(e=>{message.error("系统出错,请重新尝试")})

            }


        }else{
            const {dataSource,editIndex} = this.state;
            data.id = dataSource[editIndex].id;
            data.status = dataSource[editIndex].status;
            axios({
                url:"/purchase/"+this.props.code+"/item/"+data.id,
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
    handleDistri = () =>{
        const {selectedRows}=this.state;
        const distriRows = selectedRows.filter(item =>item.whLocationCode?false:true);
        const orders = distriRows.map(item => item.materialOrder);
        if(orders.length === 0){
            message.warning("请至少勾选一项货品")
            return;
        }
        if(this.state.code.trim() === ''){
            message.warning("请输入库位编号")
            return;
        }
        axios({
            url:"/purchase/"+this.props.code+"/deposite/"+this.state.code,
            method:"put",
            data:{orders}
        }).then(res => {
            if(res.data.code == "201"){
                message.success("分配成功");
                this.axios();
            }else{
                message.warning("分配失败,请输入正确的库位编号");
                this.axios();
            }
        }).catch(e=>message.error("系统出错,请重新尝试"))

    }
    handleSubmit = () =>{
        axios({
            url:"/purchase/"+this.props.id+"/status/"+"2",
            method:"put"
        }).then(res => {
            if(!checkCode(res.data.code))return;
            this.props.changeStatus(this.props.id)
            this.axios();
        }).catch(e =>{
            message.error("系统错误,请重新尝试")
        })


    }
    render = () => {
        const status = this.props.status;
        const columns = [
            {title:"序号",key:"order",render:(text,record,index) => index+1},
            {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
            {title:"物料名称",dataIndex:"materialName",key:"materialName"},
            {title:"采购订单单号",dataIndex:"orderNo",key:"orderNo"},
            {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder"},
            {title:"存储位置",dataIndex:"whLocationCode",key:"whLocationCode"},
            {title:"存放方式",dataIndex:"locationModeId",key:"locationModeId"},
            {title:"批次号",dataIndex:"spBatchNumber",key:"spBatchNumber"}
        ];
        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys,selectedRows) =>{
                this.setState({ selectedRowKeys,selectedRows });
            },
            getCheckboxProps: (record) =>{
                if(record.whLocationCode){
                    return{disabled:true}
                }else{
                    return{}
                }
            }

        }
        return (
            <div style={{textAlign:'left',paddingTop:10}}>
                {
                    status === "1" ?
                        (<div>
                            <Input value={this.state.code} placeholder="请输入库位编号" onChange={e => this.setState({code:e.target.value})} style={{width:150,marginRight:10}}/>
                            <Button type='primary' onClick={this.handleDistri} style={{marginRight:10}}>分配库位</Button>
                            <Button type='primary' onClick={this.handleSubmit} style={{marginRight:10, float:'right'}}>确认入库</Button>
                        </div>)
                    : ''
                }
                <Table size="middle" columns={columns} rowSelection={status === "1"? rowSelection : null} onChange={this.handleTableChange}  dataSource ={this.state.dataSource} rowKey={record=>record.id} loading={this.state.loading} pagination={this.state.pagination} rowClassName={record =>status==="2"? record.warnFlag=="warning"?"red":"":""}/>
            </div>

        )
       




    }



}
export default Table2;