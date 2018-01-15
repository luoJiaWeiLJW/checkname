import React, {Component} from 'react';
import {Modal,Form,Input,Radio,Button, Table} from 'antd';
import formConfig from './formConfig';
const FormItem = Form.Item;
class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            Object.keys(fieldsvalue).forEach((key)=>{
                fieldsvalue[key]=formConfig(key,null,fieldsvalue[key]).input.props["data-text"];
                
            })
            this.props.onOk(fieldsvalue)            

        })
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
        Object.keys(this.props.modalData).forEach((key)=>{
            if(key !== 'key'){
                const config = formConfig(key,null,null,this.props.modalData[key].title).config;
                const input = formConfig(key,null,null,this.props.modalData[key].title,this.props.modalData[key].mark).input;
                FormItems.push(
                    <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                        {getFieldDecorator(key,config)(input)}
                    </FormItem>
                )
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
            if(key !== 'key'){ 
                const value = formConfig(key,props.modalData[key].value).input.props["data-value"];
      
                obj[key]={value}                
            }
        })
        
        return obj
        }
    }
)(ModalForm);
export default ModalForm2