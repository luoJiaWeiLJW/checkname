import React, {Component} from 'react';
import {Modal,Form,Input,Select,message} from 'antd';
import checkCode from "../../../config/codeTips";
import axios from "axios";
const FormItem = Form.Item;
const Option = Select.Option
class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            const data = {};
            Object.keys(fieldsvalue).forEach(key => {
                if (key !== "voucherDate" && key !== "intoCode") {
                    data[key] = fieldsvalue[key]
                }
            })
            this.state.dataSource.forEach(item =>{
                if(fieldsvalue.warehouseId == item.value){
                    data.warehouseName = item.name
                }
            })
            this.state.groups.forEach(item =>{
                if(fieldsvalue.consigneeGroupId == item.value){
                    data.consigneeGroupName= item.name
                }
            })
            this.state.users.forEach(item =>{
                if(fieldsvalue.consigneeUserId== item.value){
                    data.consigneeUserName = item.name
                }
            })
            this.props.onOk(data)            

        })
    }
    state = {
        dataSource :[],
        groups:[],
        users:[],
    }
    componentDidMount = ()=>{
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
            url:"/session/groups",
            method:"get"
        }).then(res =>{
            if(!checkCode(res.data.code))return;
            let groups = [];
            if(res.data.data instanceof Array){
                groups = res.data.data.map(item => ({value:item.id,name:item.name}))
            }
            this.setState({groups})
            if(this.props.modalType === "edit"){
                const groupId = this.props.form.getFieldValue("consigneeGroupId");
                this.handleSearch(groupId,true);
            }

        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })

    }
    handleSearch = (value,save)=>{
        const groupId = value
        axios({
            url:"session/employees",
            params:{
                groupId,
                name:""
            }
        }).then(res=>{
            if(!checkCode(res.data.code))return
            let users = [];
            if(res.data.data instanceof Array){
                users = res.data.data.map(item => ({value:item.id, name:item.name}))
            }
            this.setState({users})
            if(!save){
                this.props.form.setFieldsValue({consigneeUserId:""})
            }
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
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
                case "purchaseCode":
                    if(type==="add"){};
                    if(type==="edit"){
                        input = <Input disabled={true}/>;
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                    {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    }
                    break;
                case "voucherDate":
                    if(type=="add"){};
                    if(type==="edit"){
                        input = <Input disabled={true}/>;
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                    {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    }
                    break;
                case "warehouseId":

                    const Options = this.state.dataSource.map(item=>{return <Option key={item.value} value={item.value}>{item.name}</Option> });
                    input = <Select notFoundContent="">{Options}</Select>
                    if(type === "edit"){
                        input = <Select notFoundContent="" disabled>{Options}</Select>
                    }
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator("warehouseId",config)(input)}
                            </FormItem>
                    )
                    break;
                case "consigneeGroupId":
                    const groups = this.state.groups.map(item => <Option key = {item.value} value={item.value}>{item.name}</Option>);
                    input = <Select  onChange={this.handleSearch}>{groups}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                            {getFieldDecorator("consigneeGroupId",config)(input)}
                        </FormItem>
                    )
                    break;
                case "consigneeUserId":
                    const users = this.state.users.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    input = <Select showSearch  optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>{users}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                            {getFieldDecorator("consigneeUserId",config)(input)}
                        </FormItem>
                    )
                    break;
                case "supplier":
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    )
                    break;
                default:break;


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