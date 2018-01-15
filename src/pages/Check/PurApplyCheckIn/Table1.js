import React, {Component} from 'react';
import {message,Table, Badge, Tooltip, Button, Popconfirm} from 'antd';
import Table2 from './Table2';
import axios from "axios";
import checkCode from "../../../config/codeTips.js"
import SearchForm from './searchForm'
import ModalForm from './ModalForm1'

class Table1 extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const visible = false;
        const modalData = {
            voucherDate:{value:"",title:"制单日期"},
            purchaseCode:{value:"",title:"单据编号"},
            supplier:{value:"",title:"供应商"},
            deliveryNumber:{value:"",title:"送货单号"},
            warehouseId:{value:"",title:"收货仓库"},
            consigneeGroupId:{value:"",title:"收货部门"},
            consigneeUserId:{value:"",title:"收货人员"},
        };
        const modalType = "";
        const editIndex = -1;
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const modalTitle="入库申请单";
        const searchData ={};
        const sorter = {order:""};
        const modalKey = "";
        this.state={pagination,loading,dataSource,visible,modalData,modalType,editIndex,modalTitle,searchData,sorter,modalKey};
        //初始化columns
        const columns = [];
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        });
        
        columns.push({
            title:"状态",key:"status",dataIndex:"status",className:"row-status",render:(text,record)=>{
                let result = "";
                switch(text){
                    case "0": result = <span><Badge status="default"/>未提交<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.handleCheck(record)}}></Button></Tooltip></span>; break;
                    case "1": result = <span><Badge status="processing"/>已提交</span>; break;
                    case "2": result = <span><Badge status="success"/>已完成</span>; break;
                }
                return result;
            }
        });
        // columns.push({
        //     title:'入库时间',key:"Storage",width:"6%"
        // })
        columns.push({
            title:"操作",key:"operation",width:"10%",render:(text,record)=>{

                let result = (
                    <span>
                        <Button size="small" type="primary" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button size="small" type="danger" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    </span>
                )
                switch (record.status){
                    case "0":break;
                    default:result = "";break;
                }
                return result;

            }
        })
        this.columns = columns;
    }
    handleSearch = (data) =>{
        const {pagination} = this.state;
        pagination.current = 1;
        pagination.total=0;
        this.setState({
            searchData:data,
            pagination
        })
        this.axios({
            ...data,
            pagesize:this.state.pagination.pagesize||10,
            pageindex:1,
            sortField:this.state.sorter.field,
            sortOrder:this.state.sorter.order
        });
    }
    axios = (params = {}) =>{

        this.setState({ loading: true});
        if(params.sortOrder){
            if(params.sortOrder instanceof Array){
                params.sortOrder=params.sortOrder.map(item=>{
                    return item=="ascend"?"A":"D";
                })
            }else{
                params.sortOrder = params.sortOrder == "ascend"?"A":"D";
            }

        }
        axios({
            url:"/purchases",
            method:"get",
            params:{
                pagesize:10,
                ...params
            }

        }).then(res =>{
            if(!checkCode(res.data.code)){
                const pagination = {...this.state.pagination};
                pagination.total=0;
                if(res.data.code == "607"){
                    this.setState({
                        loading:false,
                        dataSource:[],
                        pagination
                    })
                }else{
                    this.setState({pagination,loading:false,dataSource:[]})
                }
                return
            }
            let dataSource = [];
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            if(res.data.data instanceof Array){
                dataSource = res.data.data;
            }
            this.setState({
                pagination,
                loading:false,
                dataSource:dataSource,
            })
        }).catch(e=>{
            this.setState({loading:false})
            message.error("系统出错,请重新尝试")})
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        let pageindex = 1;
        if(sorter.field != this.state.sorter.field){
            pageindex = 1;
        }else{
            pageindex = pagination.current
        }

        pager.current = pageindex;
        pager.pagesize = pagination.pageSize;
        const sort = {};
        sort.field = sorter.field ;
        sort.order = sorter.order;
        this.setState({
            pagination: pager,
            sorter:sort
        });

        const searchData = this.state.searchData;
        setTimeout(()=>{
            this.axios({
                pagesize: pagination.pageSize,
                pageindex,
                sortField:sorter.field,
                sortOrder: sorter.order,
                ...filters,
                ...searchData
            });
        },0)

    }
    componentDidMount(){
        this.axios({pageindex:1});
    }   
    handleCheck = (record) =>{
        axios({
            url:"/purchase/"+record.id+"/status/"+"1",
            method:"put"
        }).then(res => {
            if(!checkCode(res.data.code))return;
            const {dataSource} = this.state;
            record.status = "1";
            this.setState({
                dataSource
            })
        }).catch(e =>{
            message.error("系统错误,请重新尝试")
        })


    }
    onDelete = (record) =>{
        const {searchData,pagination,sorter}= this.state;
        axios({
            url:"/purchase/"+record.id,
            method:"delete"

        }).then(res=>{
            if(!checkCode(res.data.code))return;
            this.axios({
                pageindex:pagination.current,
                pagesize:pagination.pagesize,
                ...searchData,
                sortField:sorter.field,
                sortOrder:sorter.order
            })
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })


    }
    showModal = (type,record) => {
        const {modalData} = this.state;
        Object.keys(modalData).forEach(key =>{
            if(type == "edit"){modalData[key].value = record[key]}
            if(type == "add"){modalData[key].value = ""}
        })
        let modalTitle = "采购入库单";
        if(type == "add"){modalTitle = "新增采购入库单"}
        if(type == "edit"){modalTitle = "修改采购入库单"}

        let editIndex = -1;
        this.state.dataSource.forEach((item,index)=>{
            if(item === record){editIndex = index}
        })
        const modalKey = new Date().toUTCString()+Math.random();
        this.setState({
            modalType:type,
            visible:true,
            modalData,
            modalTitle,
            editIndex,
            modalKey
        })


    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            axios({
                url:"/purchase",
                method:"post",
                data:{
                    supplier:data.supplier,
                    warehouseId:data.warehouseId,
                    consigneeGroupId:data.consigneeGroupId,
                    consigneeUserId:data.consigneeUserId,
                    deliveryNumber:data.deliveryNumber,
                }
            }).then(res=>{
                if(!checkCode(res.data.code))return;
                const {searchData,pagination,sorter}= this.state;
                this.axios({
                    pageindex:this.state.pagination.current,
                    pagesize:pagination.pagesize,
                    ...searchData,
                    sortField:sorter.field,
                    sortOrder:sorter.order
                })
            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })

        }else if(this.state.modalType === "edit"){

            axios({
                url:"/purchase/"+this.state.dataSource[this.state.editIndex].id,
                method:"put",
                data:{
                    voucherDate:data.voucherDate,
                    purchaseCode:data.purchaseCode,
                    supplier:data.supplier,
                    warehouseId:data.warehouseId,
                    consigneeUserId:data.consigneeUserId,
                    consigneeGroupId:data.consigneeGroupId,
                    deliveryNumber:data.deliveryNumber
                }
            }).then(res =>{
                if(!checkCode(res.data.code))return;
                const {dataSource} = this.state;
                Object.keys(data).forEach(key=>{
                    dataSource[this.state.editIndex][key] = data[key]
                })
                this.setState({dataSource})

            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })

        }


    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render = () => {
        const expandedRowRender = (record,index) => {
            return <Table2 index={index} code={record.purchaseCode} handleCheck={this.handleCheck} status={record.status||"1"} />;
        };
        return  (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Button className='table-add-btn' onClick={()=>{this.showModal("add")}} type="primary">增加</Button>
                <Table loading={this.state.loading} className="components-table-nested" columns={this.columns} pagination={this.state.pagination} rowKey={(record,index)=>record.id||index}  onChange={this.handleTableChange} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender} />
                <ModalForm key={this.state.modalKey} modalType={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}/>
            </div>
        )
    }
}
export default Table1;