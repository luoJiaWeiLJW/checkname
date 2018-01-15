import React, {Component} from 'react';
import { Table, Modal, Button, Popconfirm, message} from 'antd';
import ModalForm from './ModalForm1';
import Table2 from './Table2.js';
import axios from 'axios';
import SearchForm from './searchForm';
import checkCode from '../../../config/codeTips.js';

class BasicTable extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const visible = false;
        const modalData = {
            takeStockTime:{value:"",title:"盘点日期"},
            warehouseId:{value:"",title:"盘点仓库"},
            chooseCodes:{value:[],title:"盘点库位"}
        };
        const modalType = "";
        const editIndex = -1;
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const modalTitle="盘点单";
        const searchData = {};
        const sorter = {order:""};
        const details = "";
        const detailsVisible = false;
        const modalKey = "";
        this.state={pagination,modalKey,loading,dataSource,visible,modalData,modalType,editIndex,modalTitle,searchData,sorter,details,detailsVisible};
        //初始化columns
        const columns = [
            {title:"单据编号",dataIndex:"takeStockCode",key:"takeStockCode"},
            {title:"盘点日期",dataIndex:"takeStockTime",key:"takeStockTime",sorter:true},
            {title:"盘点仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"盘点人",dataIndex:"createUserName",key:"createUserName"},
            {title:"盘点部门",dataIndex:"createUserDeptName",key:"createUserDeptName"},
            {title:"盘点库位",dataIndex:"chooseCodes",key:"chooseCodes",render:(text,record,index)=>{
                return (<a href="javascript:;" onClick={()=>{this.showDetails(index)}}>详情</a>)
            }},
        ]

        columns.push({
            title:"操作",key:"operation",render:(text,record,index)=>{
                
                let result = (   
                    <span>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button size="small" type="danger" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    </span>
                )
                if(record.state == "1"){
                    result = ""
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
        sort.order = sorter.order ;
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
    axios = (params = {}) =>{

        this.setState({ loading: true });
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
            url:"/stat/takestocks",
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
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data.map(item => {
                    return {...item}
                })
            }
            this.setState({
                pagination,
                loading:false,
                dataSource,
            })
        }).catch(e=>{
            this.setState({loading:false})
            message.error("系统出错,请重新尝试")})
    }
    componentDidMount() {
        this.axios({pageindex:1});
    }

    onDelete = (record) =>{
        const {searchData,pagination,sorter}= this.state;
        axios({
            url:"/stat/takestock/code/"+record.takeStockCode,
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
    showDetails = (index)=>{
        this.setState({
            detailsVisible:true,
            details:this.state.dataSource[index].chooseCodes
        })
    }
    showModal = (type,record) => {
        const {modalData} = this.state; 
        Object.keys(modalData).forEach(key =>{
            if(type == "edit"){modalData[key].value = record[key]}
            if(type == "add"){
                if(key !== "chooseCodes"){
                    modalData[key].value = ""
                }else{
                    modalData[key].value = []
                }

            }
        })
        let modalTitle = "盘点单";
        if(type == "add"){modalTitle = "新增盘点单"}
        if(type == "edit"){modalTitle = "修改盘点单"}
        const modalKey = new Date().getTime()+Math.random();
        this.setState({
            modalType:type,
            visible:true,
            modalData,
            modalTitle,
            modalKey
        })
       
       
    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            axios({
                url:"/stat/takestock",
                method:"post",
                data:data
            }).then(res=>{
                if(res.data.code !=="200" && res.data.code !== "201" && res.data.code !== "203" && res.data.code !=="204"){
                    message.warning(res.data.msg || "操作失败");
                    return;
                }
                message.success("操作成功");
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
                url:"/stat/store/"+this.state.dataSource[this.state.editIndex].id,
                method:"put",
                data:data
            }).then(res =>{
                if(!checkCode(res.data.code))return;
                const {dataSource} = this.state;
                Object.keys[data].forEach(key=>{
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

    render = ()=> {
        const expandedRowRender = (record) =>{
             
            return <Table2 status={record.status}  code = {record.takeStockCode}/>
        } 

        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Button className='table-add-btn' onClick={()=>{this.showModal("add")}} type="primary">增加</Button>
                <Table  expandedRowRender={expandedRowRender} className="components-table-nested" columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={(record) => record.id||record.takeStockCode} dataSource ={this.state.dataSource}/>
                <ModalForm  key={this.state.modalKey} modalType={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}></ModalForm>
                <Modal title="盘点库位详情" onOk={()=>this.setState({detailsVisible:false})} onCancel={()=>this.setState({detailsVisible:false})} visible={this.state.detailsVisible}>
                  <div style={{wordWrap:"break-word"}}>{this.state.details}</div>
                </Modal>
            </div>
           
        )
        
    }



}
export default BasicTable;