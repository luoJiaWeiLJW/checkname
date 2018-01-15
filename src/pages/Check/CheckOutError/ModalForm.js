import React, {Component} from 'react';
import {Modal,Form,Input,Radio,Button, Table,Select,message} from 'antd';
import checkCode from "../../../config/codeTips";
import axios from "axios";
const FormItem = Form.Item;
const Option = Select.Option;


let timeout1;
let  currentValue1;
let inputing1 = true;
class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            const name = fieldsvalue.solveUserId;
            this.state.dataSource.forEach( item =>{
                if(item.name === name){fieldsvalue.solveUserId = item.value}
            })
            this.props.onOk(fieldsvalue)
        })
    }
    state = {
        dataSource :[]
    }
    handleBlur = ()=>{
        const value = this.props.form.getFieldValue("solveUserId");
        let flag = false;
        this.state.dataSource.forEach(item => {
            if(item.name === value){
                flag = true;
            }
        })
        if(!flag){
            this.props.form.setFieldsValue({solveUserId:""})
        }

    }
    handleChange = (value) => {
        if(!inputing1){
            inputing1 = true;
            return;
        }
        if(timeout1){
            clearTimeout(timeout1);
            timeout1 = null;
        }
        currentValue1 = value;
        timeout1 = setTimeout(()=>{
            axios({
                url:"/session/employees",
                method:"get",
                params:{
                    name:encodeURI(value.trim())
                }
            }).then(res =>{
                if (currentValue1 === value) {
                    if (!checkCode(res.data.code)) {
                        this.setState({dataSource: []})
                        return;
                    }
                    if (res.data.data instanceof Array) {
                        const dataSource = res.data.data.map(item => ({value: item.id, name: item.name}));
                        this.setState({dataSource})
                    } else {
                        this.setState({dataSource: []})
                    }
                }
            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })
        },300)
    }
    render  = ()=>{
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

        const config1 = {rules:[{required:true,message:"请输入处理人",whitespace:true},{max:32,message:"请不要超过最大长度32位"}]}
        const Options = this.state.dataSource.map( item => (<Option value={item.name} key={item.value}>{item.name}</Option>))
        const Sel = (
            <Select mode="combobox" style={{width:"100%"}} onChange={this.handleChange} notFoundContent="" showArrow={false} onSelect={this.handleSelect} filterOption={false}  onBlur={this.handleBlur}>
                {Options}
            </Select>
        );
        FormItems.push(
            <FormItem hasFeedback key="123" {...formItemLayout} label="处理人" >
                {getFieldDecorator("solveUserId",config1)(Sel)}
            </FormItem>
        )


        const config2 = {rules:[{required:true,message:"请输入处理描述",whitespace:true},{max:255,message:"请不要超过最大长度255位"}]};
        FormItems.push(
            <FormItem hasFeedback key="21345" {...formItemLayout} label="处理描述" >
                {getFieldDecorator("solveComment",config2)(<Input type="textarea" autosize/>)}
            </FormItem>
        )


        return (
            <Modal visible={this.props.visible} title="处理异常单" onCancel={this.props.onCancel} onOk={this.handleSubmit}>
                <Form>
                    {FormItems}
                </Form>
            </Modal>
        )
    }
    handleSelect = () =>{
        inputing1 = false;
    }
}
const ModalForm1 = Form.create()(ModalForm);
export default ModalForm1
