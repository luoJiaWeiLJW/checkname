import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm, message} from 'antd';
import Table2 from './Table2';
import axios from 'axios';
import checkCode from "../../../config/codeTips";
import SearchForm from './searchForm';
import ModalForm from './ModalForm';
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
        this.state = {dataSource,pagination,loading,sorter,searchData,visible,editRecord,
        abnormal:"异常",
        };
        this.props.columns.map((item) => {
            columns.push(Object.assign({},item));
        })
        /*columns.push({title:"状态",dataIndex:"state",key:"state",render:(text,record)=>{
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
            url:"/exceptions/type/out",
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
            let dataSource = res.data.data;
            if(dataSource instanceof Array){
                dataSource.map(item =>{
                    Object.keys(item).forEach(key => {
                            if(key == "out"){
                                if(item.out){
                                    item["voucherDate"]=item["out"]["voucherDate"];
                                    item["outDate"]=item["out"]["outDate"];
                                    item["predictDeliverTime"]=item["out"]["predictDeliverTime"];
                                    item["logisticsType"]=item["out"]["logisticsType"];
                                    item["logisticsCompany"]=item["out"]["logisticsCompany"];
                                    item["outGroupId"]=item["out"]["outGroupId"];
                                    item["outGroupName"]=item["out"]["outGroupName"];
                                    item["outUserId"]=item["out"]["outUserId"];
                                    item["outUserName"]=item["out"]["outUserName"];
                                    if(item.out.location){
                                        item["name"]=item.out.location.name;
                                        item["address"]=item.out.location.address;
                                        item["principalName"]=item.out.location.principalName;
                                        item["principalPhone"]=item.out.location.principalPhone;
                                        item["postcode"]=item.out.location.postcode;
                                    }else{
                                        item["name"]="-";
                                        item["address"]="-";
                                        item["principalName"]="-";
                                        item["principalPhone"]="-";
                                        item["postcode"]="-";
                                    }
                                }else{
                                    item["voucherDate"]="-";
                                    item["outDate"]="-";
                                    item["predictDeliverTime"]="-";
                                    item["logisticsType"]="-";
                                    item["logisticsCompany"]="-";
                                    item["outGroupId"]="-";
                                    item["outUserId"]="-";
                                    item["name"]="-";
                                    item["address"]="-";
                                    item["principalName"]="-";
                                    item["principalPhone"]="-";
                                    item["postcode"]="-";

                                }
                            }

                            else{
                                item[key]=item[key]||"-"
                            }
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
    addRemove=(e)=>{
        // console.log(e.materialOrder)
        
        // this.setState({
        //     abnormal:"已入异常库"
        // })
    }
    // Removes=()=>{
    //     this.setState({
    //         abnormal:'仍在库'
    //     })
    // }
    render = () => {
        const expandedRowRender = (record,index) => {
            const columns = [
                {title:"序号",key:"order",render:(text,record,index) => index+1},
                {title:"物料编码",dataIndex:"materialCode",key:"outCode",width:"10%"},
                {title:"物料名称",dataIndex:"name",key:"name",width:"6%"},
                {title:"物料序列编码",dataIndex:"materialOrder",key:"materialOrder",width:"10%"},
                {title:"规格型号",dataIndex:"standard",key:"standard",width:"6%"},
                {title:"计量子单位",dataIndex:"subUnit",key:"subUnit",width:"6%"},
                {title:"体积",dataIndex:"volume",key:"volume",width:"3%"},
                {title:"存品单价",dataIndex:"price",key:"price",width:"6%"},
                {title:"生产日期",dataIndex:"producedTime",key:"producedTime",width:"6%"},
                {title:"保质期",dataIndex:"expirationDate",key:"expirationDate",width:"6%"},
                {title:"存品批号",dataIndex:"batchNumber",key:"batchNumber",width:"6%"},
                {title:"质量要求",dataIndex:"qr",key:"qr",width:"6%"},
                {title:"发货仓库",dataIndex:"warehouse",key:"warehouse",width:"6%"},
                {title:"储存位置",dataIndex:"whLocationCode",key:"whLocationCode",width:"4%"},
                {title:"存放方式",dataIndex:"locationModeId",key:"locationModeId",width:"6%"},
                {title:"状态",dataIndex:'status1',key:'status1',width:"4%",render: (text,record, index) => {
                    // console.log(record)
                    return (
                        <span>异常</span>
                    )
                }
                },
                {title:"操作",dataIndex:'operation',key:'operation',width:"10%",render:(text,record,index)=>{
                    console.log(record)
                    return(
                        <div>
                            <Button size="small" type="primary" className="table-edit-btn" style={{float:'left',marginLeft:'-5px'}} onClick={(record)=>this.addRemove}>移入异常库</Button>
                            <Button size="small" type="primary" className="table-edit-btn" style={{float:'left',marginTop:'-22px',marginLeft:'75px'}}  onClick={this.addRemove}>仍在库</Button>
                        </div>
                    )
                }},
            ];
                       
            return <Table2 columns = {columns}  code={record.code}></Table2>;
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