import React, {Component} from 'react';
import {Modal,Form,Input,Radio,Button, Table,Select,message} from 'antd';
import axios from "axios";
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
        url:"/material/code/"+value,
        method:"get",
    }).then((res) => {
        
        if (currentValue === value) {
            if(res.data.data instanceof Array){
                callback(res.data.data);
            }else{
                callback([])
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
            if(err){
                return false;
            }
            const obj = {};
            Object.keys(fieldsvalue).forEach(key=>{
                if(key == "materialCode"){
                    return;
                }
                if(key == "hiddenCode"){
                    obj["materialCode"]=fieldsvalue["hiddenCode"]
                    return;
                }
                obj[key]=fieldsvalue[key]
            })
            
            this.props.onOk(obj)            

        })
    }
    getItemInfo = (e) =>{
        const value = e.target.value;
        if(value!==""){
            const producedTime = "2016-3-13";
            const batchNumber = "NA92374";
            this.props.form.setFieldsValue({
                producedTime,
                batchNumber
            })
        }
        
    }
    getPackInfo = (value)=>{
        let pack = "";
        this.state.packData.forEach(item=>{
            if(item.id==value){pack = item.name}
        })
        this.props.form.setFieldsValue({
            pack:pack
        })
    }
    state = {
        packData:[],
        goodsData:[]
    }
    handleChange = (value) => {
        this.props.form.setFieldsValue({
            materialCode:value
        })
        if(inputing){
            fetch(value, data => {
            this.setState({ goodsData:data }) 
            });
        }
        else{
            this.setState({goodsData:[]})
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
            expirationDate:data.expirationDate,
            qr:data.qr,
            hiddenCode:data.code,
            name:data.name
         })

        axios({
            url:"/packing/code/"+data.code,
            method:"get",
        }).then(res=>{
            const packData = [res.data.data];
            if(packData instanceof Array){
                this.setState({packData})
                this.props.form.setFieldsValue({
                        packId:packData[0].id,
                        pack: packData[0].name
                    })
                
            }
        }).catch(e=>{message.error("系统错误,请重新尝试")})
        
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
                case "materialCode":
                    const Options1 = this.state.goodsData.map(item=>{
                        return <Option key={item.id} value={item.name+"("+item.code+")"}>{item.name+"("+item.code+")"}</Option>
                    })
                    input = (
                        <Select mode="combobox" notFoundContent="" defaultActiveFirstOption={false} onSelect={this.handleSelect} showArrow={false} filterOption={false} style={{ width: 120 }} onChange={this.handleChange}>
                            {Options1}
                        </Select>
                    )
                    config.rules[0].message="请输入物料编码或物料名称";
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={"物料"} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                   
                    break;
                case "name":
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} style={{display:"none"}} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                case "hiddenCode":
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} style={{display:"none"}} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                case "materialOrder":
    
                    input = <Input onBlur={this.getItemInfo} autoComplete="off"/>
                    
                    FormItems.push(
                        <FormItem hasFeedback key={key} {...formItemLayout} label={this.props.modalData[key].title} >
                            {getFieldDecorator(key,config)(input)}
                        </FormItem>
                    )
                    break;
                case "packId":
                    const Options2 = this.state.packData.map(item=>{
                        return <Option value = {item.id}>{item.name}</Option>
                    })
                    input = (
                        <Select style={{ width: 120 }} onSelect={this.getPackInfo}>
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