import React, {Component} from 'react';
import { Table, Button,Tooltip, message} from 'antd';
import Table2 from './Table2';
import ModalForm from './ModalForm';
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
        const visible = false;
        const editRecord = {};
        this.state = {dataSource,pagination,loading,sorter,searchData,visible,editRecord};
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        })
        /*columns.push({title:"状态",dataIndex:"status",key:"status",render:(text,record)=>{
            if(text == "1"){return "已处理"};
            return <span>未处理<Tooltip title="点击修改状态"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.edit(record)}}></Button></Tooltip></span>
        }})*/
        this.columns = columns;

    }
    edit = (record)=>{
        this.setState({editRecord:record,visible:true})
    }
    handleOk = (data)=>{
        axios({
            url:"/exception/"+this.state.editRecord.id,
            method:"put",
            data:{
                state:"1",
                ...data
            }
        }).then(res =>{
            if(!checkCode(res.data.code)){return};
            this.state.editRecord.state = "1";
            this.setState({dataSource:this.state.dataSource})
        }).catch(e => {message.error("系统出错,请重新尝试")})
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
            url:"/exceptions/type/purchase",
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
            let dataSource = res.data.data;
            if(dataSource instanceof Array){
                dataSource.map(item =>{
                    Object.keys(item).forEach(key => {
                           item[key]=item[key]||"-"
                        }
                    )
                })
            }else{
                dataSource = [];
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

    render = () => {
        const expandedRowRender = (record,index) => {

            const columns = [
                {title:"序号",key:"order",render:(text,record,index) => index+1},
                {title:"物料编码",dataIndex:"materialCode",key:"materialCode"},
                {title:"物料名称",dataIndex:"purchaseItem.materialName",key:"materialName"},
                {title:"采购订单单号",dataIndex:"purchaseItem.orderNo",key:"orderNo"},
                {title:"送货单号",dataIndex:"purchaseItem.deliveryNoteNo",key:"deliveryNoteNo"},
                {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder"},
                {title:"存储位置",dataIndex:"purchaseItem.whLocationCode",key:"whLocationCode"},
                {title:"存放方式",dataIndex:"purchaseItem.locationModeId",key:"locationModeId"},

            ];

            return <Table2 columns = {columns}  code={record.code}/>;
        }


        return  (
            <div>
                <SearchForm onSearch = {this.handleSearch} />
                <Table style={{marginTop:15}} className="components-table-nested" columns={this.columns} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={record => record.id}/>
                <ModalForm key={this.state.editRecord.id||"anyKey"} onOk = {this.handleOk} onCancel={()=>{this.setState({visible:false})}}  visible={this.state.visible}/>
            </div>
        )



    }



}
export default BasicTable;