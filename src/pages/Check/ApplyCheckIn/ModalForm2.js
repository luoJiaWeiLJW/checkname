import React, {Component} from 'react';
import {Modal,Form,Input,Radio,Button, Table,Select,message} from 'antd';
import checkCode from "../../../config/codeTips";
import axios from "axios";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;


class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            const obj = {};
            Object.keys(fieldsvalue).forEach(key=>{
                obj[key]=fieldsvalue[key]
            })
            this.props.onOk(obj)
        })
    }
    getItemInfo = (e) =>{
        const value = e.target.value.trim();
        if(value!==""){
            axios({
                url:"/exte/material/"+encodeURI(encodeURI(value)),
                method:'get'
            }).then(res =>{
                if(!res.data.data){
                    message.warning("请输入正确的物料序列编码");
                    this.props.form.resetFields();
                    return;
                }

                let {materialCode,batchNumber,producedTime,producedTaskCode} = res.data.data;
                producedTime = moment(producedTime).format("YYYY-MM-DD");
                this.props.form.setFieldsValue({
                    producedTime,
                    batchNumber,
                    materialCode,
                    producedTaskCode,
                })
                axios({
                    url:"/material/code/"+encodeURI(encodeURI(materialCode)),
                    method:"get",
                }).then((res) => {
                    if(!res.data.data){
                        message.warning("查询不到相关物料信息");
                        this.props.form.resetFields();
                        return;
                    }

                    const data = res.data.data;
                    let expirationDate = data.expirationDate;
                    if (expirationDate) expirationDate = expirationDate + "";
                    this.props.form.setFieldsValue({
                        standard:data.standard,
                        expirationDate:expirationDate,
                        qr:data.qr,
                        name:data.name,

                    })

                }).catch(e=>{message.error("系统错误,请重新尝试")})

                axios({
                    url:"/packing/code/"+encodeURI(encodeURI(materialCode)),
                    method:"get",
                }).then(res=>{
                    if(!res.data.data){
                        message.warning("查询不到相关包装信息");
                        this.props.form.resetFields();
                        return;
                    }
                    const packData = [res.data.data];
                    if(packData instanceof Array){
                        this.setState({packData})
                        this.props.form.setFieldsValue({
                            packingId:packData[0].id,
                            pack: packData[0].name
                        })

                    }
                }).catch(e=>{message.error("系统错误,请重新尝试")})

            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })
        }


    }
    state = {
        packData:[]
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
            let input = <Input disabled={true} autoComplete="off"/>;
            switch (key){
                case "materialOrder":

                    input = <Input onBlur={this.getItemInfo} autoComplete="off"/>

                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;

                case "packingId":
                    const Options2 = this.state.packData.map(item=>{
                        return <Option value = {item.id} key={item.id}>{item.name}</Option>
                    })
                    input = (
                        <Select>
                            {Options2}
                        </Select>
                    )
                    FormItems.push(
                            <FormItem key={key} {...formItemLayout} label={"包装"} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "pack":
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} style={{display:"none"}} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                default:
                    if(key !== "name" && key !== "materialCode"){
                      config.rules[0].required = false
                    }
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    )
                    break;


            }


        })
        return (
            <Modal visible={this.props.visible} title={this.props.title} onCancel={this.props.onCancel} onOk={this.handleSubmit}>
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