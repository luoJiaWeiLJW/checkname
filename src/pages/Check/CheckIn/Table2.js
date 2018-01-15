import React, {Component} from 'react';
import { Table,notification, Icon, Button, Popconfirm, message,Input} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";

class Table2 extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const inputValue ="";
        const selectedRowKeys=[];
        const selectedRows = [];
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
        }
        const popVisible = false;
        this.state={dataSource,popVisible,inputValue,selectedRowKeys,selectedRows,pagination,sorter};
        this.columns = this.props.columns;
    }
    axios = () =>{
        this.setState({loading:true})
        const pageindex = this.state.pagination.current;
        const pagesize = this.state.pagination.pageSize;
        const sortField = this.state.sorter.field;
        let sortOrder = this.state.sorter.order;
        // axios.get("/store/"+this.props.code+"/goods")
            axios({
                url:'/store/'+this.props.code+'/goods',
                method:'get',
                params: {
                    pageindex,
                    pagesize,
                    sortField,
                    sortOrder,
              }
            })
            .then(res=>{
                if(!checkCode(res.data.code)){
                    this.setState({
                        loading:false,
                        dataSource:[]
                    })
                }
                let dataSource = res.data.data;
                const selectedRows = [],selectedRowKeys = [];
                if(dataSource instanceof Array){
                    dataSource.forEach(item=>{
                        Object.keys(item).forEach(key=>{
                            item[key]=item[key]||""
                        })
                        if(item.whLocationCode){
                            selectedRows.push(item);
                            selectedRowKeys.push(item.id);
                        }
                    })
                }else{
                    dataSource = [];
                }
                this.setState({
                    dataSource,
                    loading:false,
                    selectedRowKeys,selectedRows,
                    pagination: {...this.state.pagination, total: Number(res.data.total)||0}
                })
            }).catch(e=>{
            message.error("系统出错,请重新尝试");
            this.setState({
                loading:false,
                dataSource:[]
            })
        })
    }
    handleTableChange = (pagination, filters, sorter) => {
        const { current, pageSize } = pagination;
        this.setState({
            pagination: {...this.state.pagination, current, pageSize},
            sorter: sorter ? sorter : { field:null, sorter:null }
        },this.axios)
    };
    componentDidMount(){
        this.axios();
    }
    componentWillReceiveProps (){
        this.axios();
    }
    handleChange = (e)=>{
        e.preventDefault();
        const value = e.target.value;
        this.setState({inputValue:value})
    }
    handleEnter = (e)=>{
        e.preventDefault();
        const value = this.state.inputValue;
        const {dataSource} = this.state;
        dataSource.forEach(item =>{
            if(item.materialOrder === value){
                const key = item.id;
                const {selectedRowKeys,selectedRows} = this.state;
                let repeat = false;
                for(var i = 0 ;i<selectedRowKeys.length; i++){
                    if(selectedRowKeys[i] == key){
                        repeat = true
                    }
                }
                if(repeat){
                    this.setState({
                        inputValue:"",
                        selectedRowKeys:[...selectedRowKeys],
                        selectedRows:[...selectedRows]
                    })
                }else{
                    this.setState({
                        inputValue:"",
                        selectedRowKeys:[...selectedRowKeys,key],
                        selectedRows:[...selectedRows,item]
                    })
                }

            }
        })
    }
    handleDistri = () =>{
        const {selectedRows}=this.state;
        const distriRows = selectedRows.filter(item =>item.whLocationCode?false:true);
        const orders = distriRows.map(item => item.materialOrder);
        if(orders.length === 0){
            message.warning("请至少勾选一项货品")
            return;
        }
        axios({
            url:"/store/"+this.props.code+"/deposite",
            method:"put",
            data:{orders}
        }).then(res => {
            if(res.data.code == "201"){
                message.success("分配成功");
                this.axios();
            }else{
                this.axios();
                const key = new Date().toUTCString()+Math.random();
                const btn = (
                    <Button type="primary" size="small" onClick={()=>{notification.close(key);this.handleDistri();}}>重新分配</Button>
                )
                const description = res.data.data.failed.join(",");
                notification.error({
                    message:'以下货品分配失败',
                    description,
                    key,
                    placement:'topRight',
                    style:{
                        zIndex:20000
                    }
                })


            }
        }).catch(e=>message.error("系统出错,请重新尝试"))

    }
    handleCheck = ()=>{
        const {dataSource,selectedRows}=this.state;
        const hasDisRows = selectedRows.filter(item => item.whLocationCode?true:false);
        if(hasDisRows.length === dataSource.length){
            this.props.handleCheck(this.props.index);
        }else{
            this.setState({popVisible:true})
        }
    }
    handleConfirm = ()=>{
        this.setState({popVisible:false})
        this.props.handleCheck(this.props.index);
    }
    handleCancel = ()=>{
        this.setState({popVisible:false})
    }

    render = () => {
        if(this.props.status === "4"){
            const rowSelection = {
                selectedRowKeys:this.state.selectedRowKeys,
                onChange: (selectedRowKeys,selectedRows) =>{
                    this.setState({ selectedRowKeys,selectedRows });
                },
                getCheckboxProps: (record) =>{
                    if(record.whLocationCode){
                        return{disabled:true}
                    }else{
                        return{}
                    }
                }

            }

            return   (
                <div style={{textAlign:'left'}}>
                    <div style={{ marginTop:10}}>
                        <Input
                            style={{width:300}}
                            placeholder="输入物料序列编码"
                            onChange={this.handleChange}
                            value={this.state.inputValue}
                            size="large"
                            onPressEnter={this.handleEnter}
                            suffix={(
                                <Button type="primary" size="large" onClick={this.handleEnter}>
                                    <Icon type="check-square-o" />
                                </Button>
                            )}
                        />
                        <Button type="primary" size="large" onClick={this.handleDistri} style={{marginLeft:20}}>分配库位</Button>
                        <Popconfirm onCancel={this.handleCancel} onConfirm={this.handleConfirm} title="有部分货品未分配好库位,将生成入库错误信息单,确定提交吗?" visible={this.state.popVisible}><Button type="primary" size="large" onClick={this.handleCheck} style={{marginLeft:20,float:'right'}}>提交入库</Button></Popconfirm>
                    </div>
                    <Table  size="middle" columns={this.columns} rowSelection={rowSelection} onChange={this.handleTableChange} dataSource ={this.state.dataSource} rowKey={record=>record.id} loading={this.state.loading} pagination={this.state.pagination}/>
                </div>

            )
        }else{
            return(
                <div style={{textAlign:"left"}}>
                    <Table columns={this.columns} loading={this.state.loading} size="middle" onChange={this.handleTableChange} dataSource ={this.state.dataSource} rowKey={record=>record.id} rowClassName={record =>record.warnFlag=="warning"?"red":""} pagination={this.state.pagination}/>
                </div>
            )
        }




    }



}
export default Table2;