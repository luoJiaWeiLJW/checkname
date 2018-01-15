import React, {Component} from 'react';
import { Table, Modal, message} from 'antd';
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
        this.state={pagination,loading,dataSource,visible,modalData,modalType,editIndex,modalTitle,searchData,sorter,details,detailsVisible};
        //初始化columns
        const columns = [
            {title:"盘点单号",dataIndex:"takeStockCode",key:"takeStockCode"},
            {title:"盘点日期",dataIndex:"takeStockTime",key:"takeStockTime",sorter:true},
            {title:"盘点仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"盘点人",dataIndex:"createUserName",key:"createUserName"},
            {title:"盘点部门",dataIndex:"createUserDeptName",key:"createUserDeptName"},
            {title:"盘点库位",dataIndex:"chooseCodes",key:"chooseCodes",render:(text,record,index)=>{
                return (<a href="javascript:;" onClick={()=>{this.showDetails(index)}}>详情</a>)
            }},
        ]
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
            url:"/stat/takestocks/type/profit",
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
                    this.setState({loading:false,dataSource:[],pagination})
                }
                return
            }
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data
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
    componentDidMount() {
        this.axios({pageindex:1});
    }
    showDetails = (index)=>{
        this.setState({
            detailsVisible:true,
            details:this.state.dataSource[index].chooseCodes
        })
    }
    render = ()=> {
        const expandedRowRender = (record) =>{
            return <Table2 status={record.status}  code = {record.takeStockCode}/>
        } 

        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Table  expandedRowRender={expandedRowRender} className="components-table-nested" columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={(record,index) => record.intoCode||record.id||index} dataSource ={this.state.dataSource}/>
                <Modal title="盘点库位详情" onOk={()=>this.setState({detailsVisible:false})} onCancel={()=>this.setState({detailsVisible:false})} visible={this.state.detailsVisible}>
                <div style={{wordWrap:"break-word"}}>{this.state.details}</div>
                </Modal>
            </div>
           
        )
        
    }



}
export default BasicTable;