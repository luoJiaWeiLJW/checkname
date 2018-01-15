import React, {Component} from 'react';
import {Table, Icon, Button, Popconfirm, message} from 'antd';
import './BasicTable.css'
import ModalForm from '../ModalForm'
import axios from 'axios';
import checkCode from '../../config/codeTips';
import SearchForm from '../SearchForm';



class BasicTable extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const visible = false;
        const modalData = {};
        const modalType = "";
        const editIndex = -1;
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const modalTitle = "";
        const searchData ={};
        const sorter = {order:""}
        this.state={modalTitle,dataSource,visible,modalData,modalType,editIndex,loading,pagination,searchData,sorter};
        //初始化columns
        const columns = [];
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        })
        columns.push({
            title:"操作",key:"operation",render:(text,record,index)=>{
                const noEdit = this.props.noEdit;
                const noDelete = this.props.noDelete;
                let result = (
                    <span>
                        <Button type="primary" size="small" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button type="danger" size="small" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    </span>
                    
                )
                if(noEdit&&!noDelete){
                    result = (
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button type="danger" size="small" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    )
                }
                if(noEdit&&noDelete){
                    result = "";
                }
                if(noDelete&&!noEdit){
                    result = (
                        <Button type="primary" size="small" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                    )
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
            url:this.props.getUrl,
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
    onDelete = (record) =>{
        const {searchData,pagination,sorter}= this.state;
        
        axios({
            url:this.props.delUrl+record.id,
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
        const modalData = {};
        this.props.columns.map((item)=>{
            if(item.dataIndex){
                const value = (typeof record !== 'undefined')? record[item.dataIndex] :"";
                const title = item.title;
                
                modalData[item.dataIndex]={value,title};
            }
        })
        let editIndex = -1;
        if(typeof record !== 'undefined'){
            this.state.dataSource.forEach((item,index)=>{
                if(item === record){editIndex = index}
            })
        }  

        let modalTitle = "";
        if(type == "add"){modalTitle = "新增"+this.props.modalTitle}; 
        if(type == "edit"){modalTitle = "修改"+this.props.modalTitle+"信息"}; 
        this.setState({
            modalType:type,
            editIndex:editIndex,
            visible:true,
            modalData,
            modalTitle
        })
       
       
    }
    handleOk = (data) => {

        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            
            axios({
                url:this.props.addUrl,
                method:"post",
                data:data
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

        }else{
            axios({
                url:this.props.editUrl+this.state.dataSource[this.state.editIndex].id,
                method:"put",
                data:{
                    ...data
                }

            }).then (res=>{
                if(!checkCode(res.data.code))return;
                const {dataSource} =this.state;
                data.id = dataSource[this.state.editIndex].id;
                dataSource[this.state.editIndex] = data;
                this.setState({
                    dataSource
                })
            }).catch(e =>{
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
        const noAdd = this.props.noAdd;
        const addBtn = noAdd?"":(<Button className='table-add-btn' onClick={()=>{this.showModal("add")}} type="primary">增加</Button>);

        
        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}  searchKeys={this.props.searchKeys}/>
                {addBtn}
                <Table columns={this.columns} dataSource ={this.state.dataSource} expandedRowRender={this.props.expandedRowRender} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={(record,index) => record.id||index}/>
                <ModalForm type={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}></ModalForm>
            </div>
        )
       
        
   
        
        
    }



}
export default BasicTable;

