import React, {Component} from 'react';
import {Modal,Form,Input,Radio,Button, Table,DatePicker,Select,message,Tooltip} from 'antd';
import moment from 'moment';
import axios from 'axios';
import checkCode from '../../../config/codeTips';
const Option = Select.Option;
const FormItem = Form.Item;
class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            const obj = {};
            const type = this.props.modalType;
            Object.keys(fieldsvalue).forEach(key =>{
                if(key =="predictDeliverTime" ){
                    if("format" in fieldsvalue["predictDeliverTime"]){
                        obj["predictDeliverTime"] = fieldsvalue["predictDeliverTime"].format("YYYY-MM-DD");
                    }
                    else{
                        obj["predictDeliverTime"] = "";
                    }
                    return;
                }
                if(key == "name"){
                    if(type == "edit"){
                        return;
                    }
                }
                if(key == "address"){
                    if(type == "edit"){
                        return;
                    }
                }
                if(key == "principalName"){
                    if(type == "edit"){
                        return;
                    }
                }
                if(key == "principalPhone"){
                    if(type == "edit"){
                        return;
                    }
                }
                if(key == "postcode"){
                    if(type == "edit"){
                        return;
                    }
                }
                if(key == "warehouseId"){
                    this.state.warehouses.forEach(item => {
                        if(item.value === fieldsvalue[key]){
                            obj["warehouseName"] = item.name
                        }
                    })
                    obj[key]=fieldsvalue[key]
                    return
                }
                obj[key]=fieldsvalue[key]
            })
            
            this.props.onOk(obj)            

        })
    }
    clearLocation = () => {
        this.props.form.setFieldsValue({
            locationId:""
        })
    }
    getLocationInfo = (value)=>{
        this.state.dataSource.forEach(item=>{
            if(value == item.id){
                this.props.form.setFieldsValue({
                    name:item.name||"",
                    address:item.address||"",
                    principalName:item.principalName||"",
                    principalPhone:item.principalPhone||"",
                    postcode:item.postcode||""

                })
            }
        })
        
    }
    state = {
        dataSource:[],
        warehouses:[]
    }
    componentDidMount (){
        axios({
            url:"/targets",
            method:"get"
        }).then(res=>{
            if(!checkCode(res.data.code)){return}
            const dataSource = res.data.data;
            this.setState({dataSource})
        }).catch(e=>{message.error("系统出错,请重新尝试")})

        axios({
            url:"/warehouses",
            method:"get"
        }).then(res =>{
            if(!checkCode(res.data.code))return;
            const dataSource=[];
            res.data.data.map(item=>{
                dataSource.push({value:item.id,name:item.name})
            })
            this.setState({warehouses:dataSource})
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
            let config = {rules:[{required:false,message:"请输入"+this.props.modalData[key].title,whitespace:true},{max:32,message:"请不要超过最大长度32位"}]};
            let input = <Input autoComplete="off"/>;
            switch (key){
               
                case "outCode":
                    if(type=="add"){};
                    if(type=="edit"){
                        input = <Input disabled={true} autoComplete="off"/>
                        config.rules[0].required=false;
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    }
                    break;
                case "voucherDate":
                    if(type=="add"){};
                    if(type=="edit"){
                        input = <Input disabled={true} autoComplete="off"/>
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    }
                    break;

                case "locationId":
                    const Options = this.state.dataSource.map(item=>{
                        return <Option value={item.id} key={item.id}>{item.name}</Option>
                    })
                    if(type == "add"){config.rules[0].required=false}
                    let label = "购货单位";
                    if(type == "add"){label = <Tooltip title="如需新建购货单位，此项不需要选择" placement="leftTop">购货单位</Tooltip> }
                    input =(
                        <Select  onSelect={this.getLocationInfo} >
                            {Options}
                        </Select>
                    )
                        FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={label} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                        )
                    break;
                case "name":
                    if(type=="add"){input = <Input autoComplete="off" onChange={this.clearLocation}/>};
                    if(type=="edit"){input = <Input autoComplete="off" disabled={true}/>};

                    FormItems.push(
                            <FormItem hasFeedback  key={key} {...formItemLayout} label={this.props.modalData[key].title}>
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "address":
                    if(type=="add"){input = <Input autoComplete="off" onChange={this.clearLocation}/>};
                    if(type=="edit"){input = <Input autoComplete="off" disabled={true}/>};

                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "principalName":
                    if(type=="add"){input = <Input autoComplete="off" onChange={this.clearLocation}/>};
                    if(type=="edit"){input = <Input autoComplete="off" disabled={true}/>};

                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "principalPhone":
                    if(type=="add"){input = <Input autoComplete="off" onChange={this.clearLocation}/>};
                    if(type=="edit"){input = <Input autoComplete="off" disabled={true}/>};

                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "postcode":
                    if(type=="add"){input = <Input autoComplete="off" onChange={this.clearLocation}/>};
                    if(type=="edit"){input = <Input autoComplete="off" disabled={true}/>};
                    config.rules[1]={max:6,message:"请不要超过最大长度6位"};
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "salesman":
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    );
                    break;
                case "noticeNo":
                    config.rules[0].required=true;
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    );
                    break;
                case "logisticsType":
                    config.rules[1] = {max :10, message:"请不要超过最大长度10位"};
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "logisticsCompany":
                    config.rules[1] = {max :50, message:"请不要超过最大长度50位"}
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;
                case "predictDeliverTime":
                    input = <DatePicker showTime format="YYYY-MM-DD"/>;
                    config = {rules:[{type:"object",required:false,message:"请输入"+this.props.modalData[key].title}]};
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                            </FormItem>
                    );
                    break;

                case "warehouseId":
                    const options= this.state.warehouses.map(item=>{return <Option key={item.value} value={item.value}>{item.name}</Option> });
                    input = <Select>{options}</Select>
                    config.rules[0].required=true;
                    if(type == "edit"){
                        input = <Select disabled>{options}</Select>
                    }
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator("warehouseId",config)(input)}
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
            
            if(key == "predictDeliverTime"){
                if(props.modalData[key].value === ""){obj[key]={value:moment()}; }
                else{
                    const value = moment(props.modalData[key].value,"YYYY-MM-DD");
                    obj[key]={value};
                } 
                return;
            }
            
            const value = props.modalData[key].value;
            obj[key]={value}  
            

        })
        
        return obj
        }
    }
)(ModalForm);
export default ModalForm1