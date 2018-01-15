import React, {Component} from 'react';
import {message,Modal,Form,Input,Radio,Button, Table,Select,InputNumber} from 'antd';
import axios from "axios";
import checkCode from "../../../config/codeTips";
const FormItem = Form.Item;
const Option = Select.Option;
let timeout;
let currentValue;
let inputing = true;
function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
        axios({
            url:"/materials/?nameOrCode="+encodeURI(encodeURI(value)),
            method:"get",
        }).then((res) => {
            if (currentValue === value) {
                if(res.data.data instanceof Array){
                    callback(res.data.data);
                }else{
                    callback([]);
                }
            }
        });
  }

  timeout = setTimeout(fake, 300);
}



class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            console.log(err);
            if(err){
                return false;
            }
            const obj = {};
            Object.keys(fieldsvalue).forEach(key=>{
                if(key=="hiddenCode"){
                    obj["productCode"]=fieldsvalue["hiddenCode"]
                    return;
                }
                if(key == "productCode"){

                    return;
                }
                if(key == "packId"){
                    obj[key] = fieldsvalue[key];
                    obj["pack"] = this.state.pack;
                    return;
                }
                if(key == "warehouseId"){
                    obj[key] = fieldsvalue[key];
                    this.state.dataSource.forEach(item => {
                        if(item.value === obj[key]){
                            obj["warehouseName"] = item.name
                        }
                    })
                }
                obj[key]=fieldsvalue[key]
            })
            this.props.onOk(obj)

        })
    }

    state = {
        packData:[],
        goodsData:[],
        dataSource:[],
        pack:"",

    }
    handleChange = (value) => {
        this.props.form.setFieldsValue({
            productCode:value
        })
        if(inputing){
            fetch(value, data => {
            this.setState({ goodsData:data })
            });
        }else{
            this.setState({ goodsData:[]})
        }
        inputing = true;

    }
    handleSelect = (value) => {
        inputing = false;
        let data = {}
        this.state.goodsData.forEach(item=>{
            if(item.name+"("+item.code+")" == value){data=item}
        })

        this.props.form.setFieldsValue({
            standard:data.standard,
            qr:data.qr,
            hiddenCode:data.code,
            name:data.name,
            subUnit:data.subUnit
        })
        axios({
            url:"/packing/code/"+data.code,
            method:"get",
        }).then(res=>{
            if(res.data.code !== "200"){
                message.warning("该货品没有相关包装信息")
                return;
            }
            const packData = [res.data.data];
            this.setState({packData});
            this.props.form.setFieldsValue({
                    packId:packData[0].id
                })
            this.setState({
                pack:packData[0].name
            })

        }).catch(e=>{message.warning("没有相关包装信息,请换一种物料")})
    }
    componentWillMount(){
        axios({
            url:"/warehouses",
            method:"get"
        }).then(res =>{
            if(!checkCode(res.data.code))return;
            const dataSource=[];
            res.data.data.map(item=>{
                dataSource.push({value:item.id,name:item.name})
            })
            this.setState({dataSource})
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })

        axios({
            url:"/packing/code/"+this.props.modalData.hiddenCode.value,
            method:"get",
        }).then(res=>{
            if(res.data.code !== "200"){
                message.warning("该货品没有相关包装信息")
                return;
            }
            const packData = [res.data.data];
            this.setState({packData});
            this.props.form.setFieldsValue({
                packId:packData[0].id
            })
            this.setState({
                pack:packData[0].name
            })

        }).catch(e=>{message.warning("没有相关包装信息,请换一种物料")})

    }
    render () {


        const {getFieldDecorator} = this.props.form;

        const FormItems = [];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const type = this.props.modalType;
        Object.keys(this.props.modalData).forEach((key)=>{
            let config = {rules:[{required:true,message:"请输入"+this.props.modalData[key].title,whitespace:true},{max:32,message:"请不要超过最大长度32位"}]};
            let input = <Input autoComplete="off"/>;
            switch (key){
                case "productCode":
                    if(type == "add"){
                        const Options1 = this.state.goodsData.map(item=>{
                            return <Option key={item.id} value={item.name+"("+item.code+")"}>{item.name+"("+item.code+")"}</Option>
                        })
                        input = (
                            <Select mode="combobox" notFoundContent="" defaultActiveFirstOption={false} onSelect={this.handleSelect} showArrow={false} filterOption={false}  onChange={this.handleChange}>
                                {Options1}
                            </Select>
                        )
                        config.rules[0].message="请输入物料编码或物料名称";
                        config.rules[1] = {max:100,message:"请不要超过最大长度100位"};
                        FormItems.push(
                            <FormItem  key={key} {...formItemLayout} label={"产品"} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )

                    }else{
                        input = <Input autoComplete = "off" disabled={true}/>
                        config.rules[1] = {max:100,message:"请不要超过最大长度100位"};
                        config.rules[0].message="请输入物料编码或物料名称";
                        FormItems.push(
                            <FormItem  key={key} {...formItemLayout} label={"物料"} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    }
                    break;
                case "subUnit":
                    config.rules[0].required =false;
                    input = (
                        <Input disabled = {true} autoComplete="off"/>
                    )
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                case "standard":
                    config.rules[0].required =false;
                input = (
                    <Input disabled = {true} autoComplete="off"/>
                )
                FormItems.push(
                    <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                        {getFieldDecorator(key,config)(input)}
                    </FormItem>
                )
                break;
                case "qr":

                input = (
                    <Input disabled = {true} autoComplete="off"/>
                )
                FormItems.push(
                    <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                        {getFieldDecorator(key,config)(input)}
                    </FormItem>
                )
                break;
                case "name":
                    config.rules[1] = {max:64,message:"请不要超过最大长度64位"};
                    FormItems.push(
                    <FormItem style={{display:"none"}} key="name">
                        {getFieldDecorator("name",config)(input)}
                    </FormItem>
                    )
                    break;
                case "packId":
                    const Options2 = this.state.packData.map(item=>{
                        return <Option value = {item.id} key={item.id}>{item.name}</Option>
                    })
                    input = (
                        <Select notFoundContent="" disabled>
                            {Options2}
                        </Select>
                    )
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    );
                    break;
                case "pack":
                    break;
                case "number":
                    config = {rules:[{required:true,message:"请输入"+this.props.modalData[key].title}]}
                    input = (
                        <InputNumber style={{width:220}} min={0} step={1} precision={0}/>
                    )
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    );
                    break;
                case "warehouseId":
                    const Options = this.state.dataSource.map(item=>{return <Option key={item.value} value={item.value}>{item.name}</Option> });
                    input = <Select notFoundContent="" >{Options}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator("warehouseId",config)(input)}
                        </FormItem>
                    )
                    break;
                case "hiddenCode":
                    config.rules[1] = {max:100,message:"请不要超过最大长度100位"};
                    FormItems.push(
                    <FormItem style={{display:"none"}} key="hiddenCode">
                        {getFieldDecorator("hiddenCode",config)(input)}
                    </FormItem>
                    )
                    break;
                case "outboundPurposes":
                    config.rules[1] ={max:255,message:"请不要超过最大长度255位"};
                    input = <Input type="textarea" autosize/>
                    FormItems.push(
                    <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                        {getFieldDecorator(key,config)(input)}
                    </FormItem>
                    )
                    break;
                default:
                    break;


            }


        })


        return (
            <Modal visible={this.props.visible} title={this.props.title} onCancel={this.props.onCancel} onOk={this.handleSubmit} width={800}>
                <Form>
                    {FormItems}
                </Form>
            </Modal>
        )
    }
}
const ModalForm2 = Form.create(
    {
        mapPropsToFields(props){
        const obj = {};
        Object.keys(props.modalData).forEach((key)=>{
            const value = props.modalData[key].value;
            obj[key]={value}

        })
        return obj
        }
    }
)(ModalForm);
export default ModalForm2