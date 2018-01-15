import React, {Component} from 'react';
import {Modal,Form,Input,InputNumber,Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            //const obj = {};
            //const type = this.props.modalType;
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
        const type = this.props.modalType;
        Object.keys(this.props.modalData).forEach((key)=>{
            let config = {rules:[{required:true,message:"请输入"+this.props.modalData[key].title,whitespace:true},{max:32,message:"请不要超过最大长度32位"}]};
            let input = <Input autoComplete="off"/>;
            switch (key){
               
                case "name":
                    
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    
                    break;
                case "code":
                    
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                case "capacity":
                    input = (
                        <InputNumber style={{width:220}}  min={0} step={1} precision={2}/>
                    )
                    config = {rules:[{required:true,message:"请输入"+this.props.modalData[key].title}]};
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                  
                    break;
                case "managementDemand":
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                
                    break;
                case "managerId":
                    
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                break;
                case "type":
                        input = (
                            <Select>
                                <Option value = "1">成品仓</Option>
                                <Option value = "2">饰品仓</Option>
                                <Option value = "3">木材仓</Option>
                                <Option value = "4">五金仓</Option>
                            </Select>
                        )
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
const ModalForm1 = Form.create(
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
export default ModalForm1