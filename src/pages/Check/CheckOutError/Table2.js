import React, {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon, Button, Popconfirm, message} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";
class Table2 extends Component{
    constructor(props){
        super(props);
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
        const loading = false;
        const dataSource = [];
        const flag = true;
        this.state={pagination,sorter,loading,dataSource,flag};
    }
    axios=()=>{
        this.setState({loading:true})
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        sortOrder = sortOrder === "ascend" ? "A" : "sortOrder" === "descend" ? "D" : null;
        // axios.get("/exception/type/out/code/"+this.props.code+"/goods")
            axios({
                url:"/exception/type/out/code/"+this.props.code+"/goods",
                method:'get',
                params:{
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
                    })
                    return;
                }
                let dataSource = res.data.data;
                if(dataSource instanceof Array){
                    dataSource.map(item=>{
                        Object.keys(item).forEach(key=>{
                            if(key == "materialInstance"){
                                if(item.materialInstance){
                                    item["materialCode"]=item["materialInstance"]["materialCode"];
                                    item["materialOrder"]=item["materialInstance"]["materialOrder"];
                                    item["producedTime"]=item["materialInstance"]["producedTime"];
                                    item["batchNumber"]=item["materialInstance"]["batchNumber"];
                                    item["whLocationCode"]=item["materialInstance"]["whLocationCode"];
                                    item["locationModeId"]=item["materialInstance"]["locationModeId"];
                                    if(item.materialInstance.packing){
                                        const extent = parseFloat(item["materialInstance"]["packing"]["extent"])||0
                                        const width = parseFloat(item["materialInstance"]["packing"]["width"])||0
                                        const height = parseFloat(item["materialInstance"]["packing"]["height"])||0;
                                        let result = extent*width*height;
                                        result = Math.round(result*100)/100;
                                        item["volume"]=result;
                                        item["price"]=item["materialInstance"].packing.price||"-";
                                    }
                                    if(item.materialInstance.warehouse){
                                        item["warehouse"]=item["materialInstance"]["warehouse"].name;
                                    }
                                    if(item.materialInstance.material){
                                        item["name"]=item["materialInstance"]["material"].name;
                                        item["standard"]=item["materialInstance"]["material"].standard;
                                        item["subUnit"]=item["materialInstance"]["material"].subUnit;
                                        item["price"]=item["materialInstance"]["material"].price;
                                        item["expirationDate"]=item["materialInstance"]["material"].expirationDate;
                                        item["qr"]=item["materialInstance"]["material"].standard;

                                    }

                                }

                            }
                            else{
                                item[key]=item[key]||""
                            }
                        })
                    })
                }else{
                    dataSource=[]
                }

                this.setState({
                    dataSource:dataSource,
                    loading: false,
                    pagination: {...this.state.pagination, total: Number(res.data.total)||0},
                })
            }).catch(e=>{
            message.error("系统出错,请重新尝试");
                this.setState({
                    loading:false,
                })
        })
    };
    componentDidMount () {
      this.axios()
    }
    handleTableChange = (pagination, filters, sorter) => {
        const { current, pageSize } = pagination;
        this.setState({
            pagination: {...this.state.pagination, current, pageSize},
            sorter: sorter ? sorter : { field:null, sorter:null }
        },this.axios)
    }
    render = () => {
            return <Table size="middle" onChange={this.handleTableChange} rowKey={record=>record.id} loading={this.state.loading} pagination={this.state.pagination} columns={this.props.columns}  dataSource ={this.state.dataSource} />
    }



}
export default Table2;