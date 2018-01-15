import React, {Component} from 'react';
import { Table,AutoComplete, Icon, Button, Popconfirm, message,Input} from 'antd';
import checkCode from "../../../config/codeTips.js";
import axios from "axios";
import "./style.css"
class Table2 extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const inputValue ="";
        const selectedRowKeys=[];
        const selectedRows = [];
        const popVisible = false;
        const loading = false;
        this.state={dataSource,popVisible,inputValue,selectedRowKeys,selectedRows,loading};
        this.columns = this.props.columns;
    }
    componentDidMount () {
        this.setState({loading:true});
        axios.get("/withdraw/"+this.props.code+"/goods")
        .then(res =>{
           
            if(!checkCode(res.data.code)){
                this.setState({loading:false,dataSource:[]})
                return;
            }
            let dataSource = res.data.data;
            if(dataSource instanceof Array){
                dataSource.map(item=>{
                Object.keys(item).forEach(key=>{
                    if(key == "material"){
                        item["name"]=item["material"]?item.material.name:"-";
                        item["subUnit"]=item["material"]?item.material.subUnit:"-";
                        item["expirationDate"]=item["material"]?item.material.expirationDate:"-";
                        item["qr"]=item["material"]?item.material.qr:"-";
                        item["standard"]=item["material"]?item.material.standard:"-";
                       
                    }else if(key =="packing"){
                        item["pack"]=item["packing"]?item["packing"]["name"]:"-";
                    }else if(key == "warehouse"){
                        item["warehouse"]=item["warehouse"]?item.warehouse.name:"-"
                    }else if(key =="number"){
                        item[key]=item["number"]||"-";
                    }
                    else{
                        item[key]=item[key]||"-"
                    }
                })
            })
         }else{
             dataSource = [];
         }
            this.setState({
                loading:false,
                dataSource:dataSource,
            })
        }).catch(e=>{
            message.error("系统出错,请重新尝试");
            this.setState({loading:false})
        })
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
    handleCheck = ()=>{
        const {dataSource,selectedRowKeys}=this.state;
        if(selectedRowKeys.length === dataSource.length){
            this.props.handleCheck(this.props.index);
        }else{
            this.setState({popVisible:true})
        }
    }
    handleConfirm = ()=>{
        this.setState({popVisible:false})
        const {selectedRows}=this.state;
        let str = "";
        for(var i = 0; i <selectedRows.length; i++){
            if(i == selectedRows.length -1){
                str += selectedRows[i].materialOrder
            }else{
                str += selectedRows[i].materialOrder+","
            }
        }
        axios({
            url:"/exception/code/"+this.props.code+"/type/out",
            method:"post",
            data:{
                orders:str
            }
        }).then(res =>{
            if(res.data.code !== "200" && res.data.code !== "201")
            {
                message.warning("生成出库错误信息单失败")
                return;
            }
            message.success("生成出库错误信息单成功")
            this.setState({loading:true});
            this.props.handleCheck(this.props.index)
                .then(()=> axios.get("/withdraw/" + this.props.code + "/goods"))
                .then(res =>{
                    if(!checkCode(res.data.code)){
                        this.setState({loading:false,dataSource:[]})
                        return;
                    }
                    let dataSource = res.data.data;
                    if(dataSource instanceof Array){
                        dataSource.map(item=>{
                            Object.keys(item).forEach(key=>{
                                if(key == "material"){
                                    item["name"]=item["material"]?item.material.name:"-";
                                    item["subUnit"]=item["material"]?item.material.subUnit:"-";
                                    item["expirationDate"]=item["material"]?item.material.expirationDate:"-";
                                    item["qr"]=item["material"]?item.material.qr:"-";
                                    item["standard"]=item["material"]?item.material.standard:"-";

                                }else if(key =="packing"){
                                    item["pack"]=item["packing"]?item["packing"]["name"]:"-";
                                }else if(key == "warehouse"){
                                    item["warehouse"]=item["warehouse"]?item.warehouse.name:"-"
                                }
                                else{
                                    item[key]=item[key]||""
                                }
                            })
                        })
                    }else{
                        dataSource = [];
                    }
                    this.setState({
                        loading:false,
                        dataSource:dataSource,
                    })
                }).catch(e=>{
                message.error("系统出错,请重新尝试");
                this.setState({loading:false})
                })

        }).catch(() =>{message.error("系统出错,请重新尝试")})
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
                }

            }

            return   (
                    <div style={{textAlign:'left'}}>
                        <div style={{ marginTop:10,width:500}}>
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
                            <Popconfirm onCancel={this.handleCancel} onConfirm={this.handleConfirm} title="有部分货品未勾选,将生成出库错误信息单,确定提交吗?" visible={this.state.popVisible}><Button type="primary" size="large" onClick={this.handleCheck} style={{marginLeft:20}}>提交核对结果</Button></Popconfirm>
                        </div>
                        <Table size="middle" loading={this.state.loading} columns={this.columns} rowSelection={rowSelection} dataSource ={this.state.dataSource} rowKey={record=>record.id}/>
                    </div>

            )
        }else{
            return(
                <div style={{textAlign:"left"}}>
                    <Table columns={this.columns} size="middle" loading={this.state.loading} dataSource ={this.state.dataSource} rowKey={record=>record.id} rowClassName={record =>record.warnFlag=="warning"?"red":""}/>
                </div>
            )
        }
        
       
       
        
    }



}
export default Table2;