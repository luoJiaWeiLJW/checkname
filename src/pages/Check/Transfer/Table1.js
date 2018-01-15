import React, {Component} from 'react';
import { message,Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm} from 'antd';
import Table2 from './Table2';
import axios from 'axios';
import checkCode from '../../../config/codeTips';
import SearchForm from './searchForm';
import ModalForm from './ModalForm1'

class BasicTable extends Component{
    constructor(props){
        super(props);
        const disableState={
            AddState:false,
            ExecutionState:false,
            DeleteState:false,
        };
        const dataSource = [];
        const visible = false;
        const modalData = {};
        const modalType="add";
        const editIndex = -1;
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const modalTitle = "新增移库单";
        const searchData = {};
        const sorter = {order:""};
        const modalKey = "";
        this.state={modalTitle,pagination,loading,dataSource,visible,modalData,modalType,editIndex,searchData,sorter,modalKey,disableState,};
        //初始化columns
        const columns = [];
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        })
        columns.push({
            title:"操作",width:150,key:"operation",render:(text,record)=>{
                
                let result = (   
                    <span>
                        <Popconfirm title="确定执行吗?" onConfirm={() => this.onExecution(record)}>
                            <Button size="small" type="danger" className="table-del-btn">执行</Button>
                        </Popconfirm>
                        {record.custom==="1"?
                            <Popconfirm title="确定执行吗?" onConfirm={() => this.onDelete(record)}>
                                <Button size="small" type="danger" className="table-del-btn">删除</Button>
                            </Popconfirm>:null
                        }
                    </span>
                )
                if(record.state === "1"){
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
        sort.field = sorter.field;
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
            url:"/transfers",
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
            };
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data;
            }
            this.setState({
                pagination,
                loading:false,
                dataSource
            })
        }).catch(e =>{
             message.error("系统出错,请重新尝试");
             this.setState({loading:false})
        })
    }
    componentDidMount() {
        this.axios({pageindex:1});
    }
    

    onExecution = (record) =>{
        const {searchData,pagination,sorter}= this.state;
        axios({
            url:"/transfer/"+record.id+"/exe",
            method:"put",
        }).then(res=>{
            if(!checkCode(res.data.code))return;
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
       
    };
    onDelete=(record)=>{
        const {searchData,pagination,sorter}= this.state;
        axios({
            url:"/transfer/"+record.id,
            method:"delete",
        }).then(res=>{
            if(!checkCode(res.data.code))return;
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
    }
    showModal = () => {
        const modalKey = new Date().toUTCString()+Math.random();
        this.setState({
            visible:true,
            modalKey
        })
       
       
    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
            axios({
                url:"/transfer",
                data:{
                    ...data
                },
                method:"post"
            }).then((res)=>{
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
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render = ()=> {
        const expandedRowRender = (record,index) => {
            return <Table2 index={index} custom={record.custom} id={record.id} handleCheck={this.handleCheck} state={record.state||"1"} />;
        };
        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Button className='table-add-btn' onClick={()=>{this.showModal()}} type="primary">增加</Button>
                <Table  className="components-table-nested" columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={record => record.id} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender}/>
                <ModalForm key={this.state.modalKey} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}/>
            </div>
           
        )
        
    }



}
export default BasicTable;