import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm, message} from 'antd';
import Table2 from './Table2';
import axios from 'axios';
import checkCode from "../../../config/codeTips";
import SearchForm from './searchForm';
class BasicTable extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const columns = [];
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const searchData = {};
        const sorter = {order:""};
        this.state = {dataSource,pagination,loading,sorter,searchData};
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        })
        columns.push({
            title:"状态",key:"status",dataIndex:"status",className:"row-status",render:(text,record,index)=>{
                let result;
                if(text == "5"){
                    result = <span><Badge status="success"/>已完成</span>
                }else if(text == "4"){
                    result = <span><Badge status="processing"/>待出库</span>
                }else if(text == "3"){
                    result = <span><Badge status="processing"/>分配完成</span>
                }else if(text == "2"){
                    result = <span><Badge status="processing"/>分配库位中</span>
                }else if (text == "1"){
                    result = <span><Badge status="processing"/>已提交</span>
                }else if(text == "0"){
                    result = <span><Badge status="default"/>未提交</span>
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
            url:"/withdraws",
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
                    this.setState({loading:false,dataSource:[],pagination})
                }
                return
            }
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data;
                dataSource.map(item =>{
                    Object.keys(item).forEach(key => {
                            if(key == "location"){
                                if(item.location){
                                    item["name"]=item["location"]["name"];
                                    item["address"]=item["location"]["address"];
                                    item["principalName"]=item["location"]["principalName"];
                                    item["principalPhone"]=item["location"]["principalPhone"];
                                    item["postcode"]=item["location"]["postcode"];
                                }else{
                                    item["name"]=""
                                    item["address"]=""
                                    item["principalName"]=""
                                    item["principalPhone"]=""
                                    item["postcode"]=""
                                }

                            }else{
                                item[key]=item[key]||""
                            }

                        }

                    )
                })
            }

            this.setState({
                pagination,
                loading:false,
                dataSource:dataSource,
            })
        }).catch(e=>{this.setState({loading:false});message.error("系统出错,请重新尝试")})
    }
    componentDidMount() {
        this.axios({pageindex:"1"});
    }
    handleCheck = (index) =>{

     return axios({
                 url:"/withdraw/code/"+this.state.dataSource[index].outCode+"/status/"+"5",
                 method:"put"
             }).then(res => {
                 if(res.data.code !== "200" && res.data.code !== "201"){
                     message.warning("修改出库单状态失败")
                     return;
                 }
                 message.success("修改出库单状态成功")
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
                {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
                {title:"物料名称",dataIndex:"name",key:"name"},
                {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder"},
                {title:"规格型号",dataIndex:"standard",key:"standard"},
                {title:"包装",dataIndex:"pack",key:"pack"},
                {title:"生产日期",dataIndex:"producedTime",key:"producedTime"},
                {title:"计量子单位",dataIndex:"subUnit",key:"subUnit"},
                {title:"质量要求",dataIndex:"qr",key:"qr"},
                {title:"发货仓库",dataIndex:"warehouse",key:"warehouse"},
                {title:"储存位置",dataIndex:"whLocationCode",key:"whLocationCode"},
                {title:"存放方式",dataIndex:"locationModeId",key:"locationModeId"},
                {title:"批次号",dataIndex:"spBatchNumber",key:"spBatchNumber"}
            ];

            return <Table2 columns = {columns}  index={index} handleCheck={this.handleCheck} status={record.status} code={record.outCode}></Table2>;
        }


        return  (
            <div>
                <SearchForm onSearch = {this.handleSearch} />
                <Table style={{marginTop:15}} className="components-table-nested" columns={this.columns} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={record => record.id}/>

            </div>
        )



    }



}
export default BasicTable;