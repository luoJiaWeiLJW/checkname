import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm, message} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";
class Table2 extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const loding = false;
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
        this.state={dataSource,loding,pagination,sorter};
    }
    axios=()=>{
        this.setState({
            loading:true
        });
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        sortOrder = sortOrder === "ascend" ? "A" : "sortOrder" === "descend" ? "D" : null;
            axios({
                url:"/exception/type/purchase/code/"+this.props.code+"/goods",
                method:'get',
                params: {
                    pageindex,
                    pagesize,
                    sortField,
                    sortOrder,
                }
            })
            .then(res =>{
                if(!checkCode(res.data.code)){
                    this.setState({
                        loading:false,
                        dataSource:[]
                    });
                    return;
                }
                let dataSource = res.data.data;
                if(dataSource instanceof Array){
                    dataSource.map(item=>{
                        Object.keys(item).forEach(key=>{
                            item[key]=item[key]||""
                        })
                    })
                }else{
                    dataSource=[]
                }

                this.setState({
                    dataSource:dataSource,
                    loading:false,
                    pagination: {...this.state.pagination, total: Number(res.data.total)||0},
                })
            }).catch(e=>{
            this.setState({
                loading:false,
                dataSource:[]
            });
            message.error("系统出错,请重新尝试")
        })
    }
    componentDidMount () {
        this.axios();
    }
    handleTableChange = (pagination, filters, sorter) => {
        const { current, pageSize } = pagination;
        this.setState({
            pagination: {...this.state.pagination, current, pageSize},
            sorter: sorter ? sorter : { field:null, sorter:null }
        },this.axios)
    }
    render = () => {
            return <Table size="middle" loading={this.state.loading} rowKey={record=>record.id} columns={this.props.columns} pagination={this.state.pagination} onChange={this.handleTableChange}  dataSource ={this.state.dataSource} />
    }



}
export default Table2;