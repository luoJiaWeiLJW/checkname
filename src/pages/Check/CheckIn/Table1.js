import React, {Component} from 'react';
import {message,Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm} from 'antd';
import Table2 from './Table2';
import axios from "axios";
import checkCode from "../../../config/codeTips.js"

import SearchForm from './searchForm'
class Table1 extends Component{

    constructor(props){
        super(props);
        const dataSource = [];
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const searchData ={};
        const sorter = {order:""};
        this.state={dataSource,pagination,loading,sorter,searchData};
        //初始化columns
        const columns = [];
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        });
        columns.push({
            title:"状态",key:"status",dataIndex:"status",width:'5%',render:(text,record,index)=>{
                let result = "";
                switch(text){
                    case "0": result = <span><Badge status="default"/>未提交</span>; break;
                    case "1": result = <span><Badge status="processing"/>已提交</span>; break;
                    case "2": result = <span><Badge status="processing"/>分配库位中</span>; break;
                    case "3": result = <span><Badge status="processing"/>分配完成</span>; break;
                    case "4": result = <span><Badge status="processing"/>待入库</span>; break;
                    case "5": result = <span><Badge status="success"/>已完成</span>; break;
                }
                return result;
            }
        });
        columns.push({
            title:'入库时间',key:'intoDate',dataIndex:'intoDate',width:'6%',marginLeft:'-15px'
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
            url:"/stores",
            method:"get",
            params:{
                await: true,
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
    handleCheck = (index) =>{
        axios({
            url:"/store/"+this.state.dataSource[index].intoCode+"/status/"+"5",
            method:"put"
        }).then(res => {
            if(!checkCode(res.data.code))return;
            const {dataSource} = this.state;
            dataSource[index].status = "5";
            this.setState({
                dataSource
            })
        }).catch(e =>{
            message.error("系统错误,请重新尝试")
        })
        
    }

    render = () => {
        const expandedRowRender = (record,index) => {
            const columns = [
                {title:"序号",key:"order",render:(text,record,index) => index+1},
                {title:"生产任务单号",key:"producedTaskCode",dataIndex:"producedTaskCode",width:'7%'},
                {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
                {title:"物料名称",dataIndex:"name",key:"name"},
                {title:"规格型号",dataIndex:"standard",key:"standard",width:'5%'},
                {title:"包装",dataIndex:"pack",key:"pack"},
                {title:"计量单位",dataIndex:"unit",key:"unit"},
                {title:"质量要求",dataIndex:"qr",key:"qr"},
                {title:"保质期",dataIndex:"expirationDate",key:"expirationDate"},
                {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder"},
                {title:"生产日期",dataIndex:"producedTime",key:"producedTime"},
                {title:"生产批号",dataIndex:"batchNumber",key:"batchNumber"},
                {title:"储存位置",dataIndex:"whLocationCode",key:"whLocationCode"},
                {title:"存放方式",dataIndex:"locationMode",key:"locationMode"},
                {title:"批次号",dataIndex:"spBatchNumber",key:"spBatchNumber",width:'10%'},
            ];
                         
            return <Table2 columns = {columns} index={index} code={record.intoCode} handleCheck={this.handleCheck} status={record.status||"1"} />;
        };
        return  (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Table style={{marginTop:15}} loading={this.state.loading} className="components-table-nested" columns={this.columns} pagination={this.state.pagination} rowKey={record=>record.id}  onChange={this.handleTableChange} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender} />
            </div>
        )
    }
}
export default Table1;