import React, {Component} from 'react';
import {Modal,Form,Input,Transfer,Select,message,DatePicker} from 'antd';
import checkCode from "../../../config/codeTips";
import axios from "axios";
import  moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option
class ModalForm extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsvalue)=>{
            if(err){
                return false;
            }
            const obj = {};
            Object.keys(fieldsvalue).forEach(key =>{
                if(key == "takeStockTime"){
                    obj[key] = fieldsvalue[key].format("YYYY-MM-DD")+" 00:00:00";
                    return;
                }
                obj[key] = fieldsvalue[key]
            })
            const {chooseCodes} = this.state;
            if(chooseCodes.length === 0){
                message.warning("请至少选择一个库位")
                return
            }

            obj["chooseCodes"] = chooseCodes.join(",");
            this.props.onOk(obj)
        })
    }
    state = {
        dataSource :[],
        codes:[],
        chooseCodes:[],
    }
    searchCodes  = (id = "") =>{
        axios({
            url:"/warehouse_slot_code/"+id,
            method:"get"
        }).then( res =>{
            if(!checkCode(res.data.code))return;
            let codes = [];
            if(res.data.data instanceof Array){
                codes = res.data.data.map(item => ({
                    key:item,
                    title:item,
                }))
            }
            this.setState({codes,chooseCodes:[]})
        }).catch(e => message.error("系统出错,请重新尝试"))
    }

    componentDidMount(){
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
    }
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
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

                case "takeStockTime":
                    input = <DatePicker/>;
                    config = {rules:[{required:true,message:"请输入"+this.props.modalData[key].title}]};
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )

                    break;
                case "warehouseId":

                    const Options = this.state.dataSource.map(item=>{return <Option key={item.value} value={item.value}>{item.name}</Option> });
                    input = <Select onChange = {this.searchCodes}>{Options}</Select>
                    FormItems.push(
                            <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                                {getFieldDecorator("warehouseId",config)(input)}
                            </FormItem>
                    )
                    break;

                case "chooseCodes":

                    /*const codes = this.state.codes.map( item => <Option value={item} key={item}>{item}</Option>)
                    input = <Select mode="multiple">{codes}</Select>*/
                    input = <Transfer
                        dataSource={this.state.codes}
                        showSearch
                        filterOption={this.filterOption}
                        targetKeys={this.state.chooseCodes}
                        onChange={chooseCodes => this.setState({chooseCodes}) }
                        render={item => item.title}
                        listStyle={{height:400}}
                    />
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {input}
                        </FormItem>
                    )
                    break;

            }

           
        })

        return (
            <Modal width={726} visible={this.props.visible} title={this.props.title} onCancel={this.props.onCancel} onOk={this.handleSubmit}>
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
            if(key == "takeStockTime"){
                const value = moment();
                obj[key]={value};
                return
            }
            const value = props.modalData[key].value;
            obj[key]={value}  
        })
        
        return obj
        }
    }
)(ModalForm);
export default ModalForm1