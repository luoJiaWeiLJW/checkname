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
                if(fieldsvalue.provideGroupId == item.value){
                    data.provideGroupName = item.name
                }
            })
            this.state.users.forEach(item =>{
                if(fieldsvalue.provideUserId == item.value){
                    data.provideUserName = item.name
                }
            })
            this.state.csgUsers.forEach(item =>{
                if(fieldsvalue.consigneeUserId == item.value){
                    data.consigneeUserName = item.name
                }
            })
            this.props.onOk(data)            

        })
    }
    state = { //以下几个数据都是需要用到的下拉框选项
        dataSource :[], 
        groups:[],
        users:[],
        csgUsers:[]
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
                const groupId = this.props.form.getFieldValue("provideGroupId");
                this.handleSearch(groupId,true);
            }
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })
        axios({
            url:"/session/employees",
            params:{
                name:""
            }
        }).then(res=>{
            if(!checkCode(res.data.code))return
            let csgUsers = [];
            if(res.data.data instanceof Array){
                csgUsers = res.data.data.map(item => ({value:item.id, name:item.name}))
            }
            this.setState({csgUsers})
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })

    }
    handleSearch = (value,save)=>{
        const groupId = value;
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
            if(!save){
                this.props.form.setFieldsValue({provideUserId:""})
            }

            this.setState({users})
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
                case "intoCode":
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
                    if(type === "edit"){
                        input = <Select notFoundContent="" disabled>{Options}</Select>
                    }
                    else{
                        input = <Select notFoundContent="">{Options}</Select>
                    }

                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator("warehouseId",config)(input)}
                            </FormItem>
                    )
                    break;
                case "provideGroupId":
                    const groups = this.state.groups.map(item => <Option key = {item.value} value={item.value}>{item.name}</Option>);
                    input = <Select  onChange={this.handleSearch}>{groups}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                            {getFieldDecorator("provideGroupId",config)(input)}
                        </FormItem>
                    )
                    break;
                case "provideUserId":
                    const users = this.state.users.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    input = <Select showSearch  notFoundContent="" optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>{users}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                            {getFieldDecorator("provideUserId",config)(input)}
                        </FormItem>
                    )
                    break;
                case "consigneeUserId":
                    const csgUsers = this.state.csgUsers.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    input = <Select showSearch  optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>{csgUsers}</Select>
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                            {getFieldDecorator("consigneeUserId",config)(input)}
                        </FormItem>
                    )
                    break;

                case "carNumber":
                    config.rules[1] = {max:10,message:"请不要超过最大长度10位"};
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
               case "logisticsCompany":
                    config.rules[1] = {max:50,message:"请不要超过最大长度50位"};
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                default:
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