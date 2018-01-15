import React, {Component} from 'react';
import {message, Table, Menu, Icon, Button, Popconfirm} from 'antd';
import ModalForm2 from './ModalForm2'
import axios from 'axios';
import checkCode from '../../../config/codeTips';
class Table2 extends Component{
    constructor(props){
        super(props);
        const visible = false;
        const modalData = {
            productCode:{value:"",title:"物料"},
            name:{value:"",title:"产品名称"},
            standard:{value:"",title:"规格型号"},
            subUnit:{value:"",title:"包装"},
            qr:{value:"",title:"计量子单位"},
            packId:{value:"",title:"包装"},
            pack:{value:"",title:"包装"},
            number:{value:"",title:"数量"},
            outboundPurposes:{value:"",title:"出库用途"},
            hiddenCode:{value:"",title:"产品代码"},

        };
        const modalkey = "";
        const modalType = "";
        const editIndex = -1;
        const dataSource=[];
        const count = 0;
        const modalTitle = "出库单项";
        const loading = false;
        const pagination = {
            amount: 0,
            showTotal: amount => '总数量： '+ this.state.pagination.amount
        }
        this.state={visible,dataSource,modalData,count,modalType,editIndex,modalkey,modalTitle,pagination,loading};

    }
    axios = () =>{
      this.setState({loading:true})
      axios({
        url: "/withdraw/code/"+this.props.code+"/items",
        method: 'get'
      }).then(res =>{
        if(!checkCode(res.data.code)){
          this.setState({
            dataSource:[],
            loading:false
          })
          return;
        }
        let dataSource = res.data.data;
        let amount = 0;
        console.log(dataSource)
        if(dataSource instanceof Array){
          dataSource.map(item => {
            Object.keys(item).forEach(key => {
              if(key === "packing"){
                if(item["packing"]){
                  item["pack"] = item["packing"]["name"];
                  item["packId"] = item["packing"]["id"];
                }else{
                  item["pack"]=""
                }
              }else if(key === "material"){
                if(item["material"]){
                  item["name"] = item["material"]["name"];
                  item["standard"] = item["material"]["standard"];
                  item["subUnit"] = item["material"]["subUnit"];
                  item["qr"] = item["material"]["qr"];
                }else{
                  item["name"] = ""
                  item["standard"] = ""
                  item["subUnit"] = ""
                  item["qr"] = ""
                }

              }else{
                item[key] = item[key]||""
              }
            })
          })
        }else{
          dataSource=[]
        }
        Object.keys(dataSource).forEach(key => {
          amount += Number(dataSource[key]['number'])||0;
        })
        console.log("amount======"+amount)
        this.setState({
          dataSource,
          loading:false,
          pagination: {...this.state.pagination, amount: amount}
        });
        this.props.handleChangeTotal(dataSource.length);
      }).catch(e=>{message.error("系统出错,请重新尝试")})
    }
    componentDidMount () {
        this.axios()
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
          pagination: {...this.state.pagination}
        },this.axios)
    }
    onDelete = (record) =>{
        axios({
            url:"/withdraw/code/"+this.props.code+"/item/"+record.id,
            method:"delete",

        }).then(res =>{
            if(!checkCode(res.data.code)){ return }
            const dataSource = [...this.state.dataSource];
            let i = -1;
            this.state.dataSource.forEach((item,index) =>{
                if(item === record){i = index}
            })
            dataSource.splice(i, 1);
            let amount = this.state.pagination.amount;
            amount -= Number(record.number)||0;
            this.setState({
              dataSource,
              pagination: {...this.state.pagination, amount: amount}
            })
            this.props.handleChangeTotal(dataSource.length);
        }).catch(e =>{message.error("系统出错,请重新尝试")})
    }
    showModal = (type,record) => {
        const modalData = {
            productCode:{value:"",title:"物料"},
            name:{value:"",title:"产品名称"},
            standard:{value:"",title:"规格型号"},
            subUnit:{value:"",title:"计量子单位"},
            qr:{value:"",title:"质量要求"},
            packId:{value:"",title:"包装"},
            pack:{value:"",title:"包装"},
            number:{value:"",title:"数量"},
            outboundPurposes:{value:"",title:"出库用途"},
            hiddenCode:{value:"",title:"产品代码"},

        };

        if(type == "edit"){

            Object.keys(modalData).forEach(key =>{
                if(key !== "productCode" && key !=="hiddenCode"){
                    modalData[key].value = record[key];
                }
            })
            modalData.productCode.value = record.name+"("+record.productCode+")";
            modalData.hiddenCode.value = record.productCode;

        }


        let editIndex = -1;
        this.state.dataSource.forEach((item,index)=>{
            if(item === record){editIndex = index}
        })
        let modalTitle = "";
        if(type == "add") modalTitle = "新增出库单项";
        if(type == "edit") modalTitle = "修改出库单项";

        let modalkey = "";
        if(type == "add"){
            modalkey ="add"
        }
        if(type == "edit"){
            modalkey = record.id
        }
        this.setState({
            modalType:type,
            editIndex:editIndex,
            visible:true,
            modalData:modalData,
            modalkey,
            modalTitle
        })
    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            let repeat = false;
            this.state.dataSource.forEach(item=>{
                if(item.productCode == data.productCode){
                    repeat = true;
                    message.warning("请不要重复添加同一类货品")
                }
            })
            if(!repeat && this.props.code && this.props.code != ''){
                axios({
                    url:"/withdraw/code/"+this.props.code+"/item",
                    method:"post",
                    data:{
                        packId:data.packId,
                        number:data.number,
                        outboundPurposes:data.outboundPurposes,
                        productCode:data.productCode
                    }
                }).then(res =>{
                    if(res.data.code !=="200" && res.data.code !=="201" && res.data.code !== "204"){
                        message.warning(res.data.msg || "操作失败")
                        return;
                    }
                    const {dataSource} = this.state;
                    data.id = res.data.data.id||"";
                    let amount = this.state.pagination.amount;
                    amount += Number(data.number)||0
                    this.setState({
                        dataSource:[data,...dataSource],
                        pagination: {...this.state.pagination, amount: amount}
                    })
                    this.props.handleChangeTotal(dataSource.length+1);
                }).catch(e=>{message.error("系统出错,请重新尝试")})
            }

        }else{
            const {dataSource,editIndex} = this.state;
            data.id = dataSource[editIndex].id;
            data.status = dataSource[editIndex].status;
            let oldNum = dataSource[editIndex].number;
            axios({
                url:"/withdraw/code/"+this.props.code+"/item/"+data.id,
                method:"put",
                data:{
                    packId:data.packId,
                    batchNumber:data.batchNumber,
                    number:data.number,
                    outboundPurposes:data.outboundPurposes,
                    productCode:data.productCode
                }
            }).then((res)=>{
                if(!checkCode(res.data.code)){return}
                dataSource[editIndex] = data;
                let amount = this.state.pagination.amount;
                amount = amount - Number(oldNum)||0 + Number(data.number)||0
                this.setState({
                  dataSource,
                  pagination: {...this.state.pagination, amount: amount}
                })
            }).catch(e=>{message.error("系统出错,请重新尝试")})

        }

    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render = ()=> {
        const status = this.props.status;
        const columns = [
            {title:"序号",key:"order",render:(text,record,index) => index+1},
            {title:"产品代码",dataIndex:"productCode",key:"productCode"},
            {title:"产品名称",dataIndex:"name",key:"name"},
            {title:"规格型号",dataIndex:"standard",key:"standard"},
            {title:"包装",dataIndex:"pack",key:"pack"},
            {title:"计量子单位",dataIndex:"subUnit",key:"subUnit"},
            {title:"质量要求",dataIndex:"qr",key:"qr"},
            {title:"数量",dataIndex:"number",key:"number"},
            {title:"出库用途",dataIndex:"outboundPurposes",key:"outboundPurposes"},
        ];
        if(status === "0"){
            columns.push({
                title:"操作",key:"operation",render:(text,record,index)=>{
                    return (
                        <span>
                            <Button size="small" type="primary" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                                <Button size="small" type="danger" className="table-del-btn">删除</Button>
                            </Popconfirm>
                        </span>
                    )
                }
            })
        }
        let result = (
            <div style={{textAlign:"left"}}>
                <Button  style={{marginTop:5}} type="primary" onClick={()=>{this.showModal("add")}}>增加</Button>
                <Table size="middle" columns={columns} dataSource ={this.state.dataSource} rowKey={record=>record.id} loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange}/>
                <ModalForm2 key={this.state.modalkey} title = {this.state.modalTitle} modalType={this.state.modalType}
                            visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}/>
            </div>
        )
        if(status !== "0"){
            result = (
            <div style={{textAlign:"left"}}>
                <Table size="middle" columns={columns} dataSource ={this.state.dataSource} onChange={this.handleTableChange} pagination={this.state.pagination} loading={this.state.loading} rowKey={record=>record.id} expandedRowRender={this.props.expandedRowRender}/>
            </div>
            )
        }
        return result;
    }
}
export default Table2;