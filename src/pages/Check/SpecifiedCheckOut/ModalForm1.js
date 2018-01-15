import React, {Component} from 'react';
import {Form, Input, Modal,Select,message} from 'antd';
import axios from 'axios';
import checkCode from '../../../config/codeTips';
const FormItem = Form.Item;
const Option = Select.Option;

class ModalForm extends Component {
    state = {
        whIdData: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, fieldsvalue) => {
            if (err) {
                return false;
            }

            this.props.onOk(
                {...this.props.modalData, ...fieldsvalue}
            )

        })
    }
    componentDidMount = () => {
        axios({
            url: '/warehouses',
            method: 'get',
        }).then((res) => {
            if (!checkCode(res.data.code)) return;
            const data=res.data.data;
            let whIdData=[];
            data.map(item=>{
                whIdData.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
            });
            this.setState({
                whIdData
            })
        })
    };
    getItemInfo = (e) =>{
        const value = e.target.value.trim();
        if(value!==""){
            axios({
                url:"/exte/material/"+encodeURI(encodeURI(value)),
                method:'get'
            }).then(res =>{
                if(!res.data.data){
                    message.warning("请输入正确的单据编号");
                    this.props.form.resetFields();
                    // return;
                }

            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })
        }
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const {modalType, modalData} = this.props;
        const {whIdData}=this.state;
        const input = <Input autoComplete="off" onBlur={this.getItemInfo}/>;
        return (
            <Modal visible={this.props.visible} title={modalType === 'add' ? '新增指定出库单' : '编辑指定出库单'} onCancel={this.props.onCancel} onOk={this.handleSubmit}>
                <Form>
                    <FormItem hasFeedback {...formItemLayout} label='出库类型' key='type'>
                        {getFieldDecorator('type', {
                            initialValue: modalData['type']?modalData['type'].value:null,
                            rules: [
                                {required: true, message: "请选择出库类型", whitespace: true},
                                {max: 32, message: "请不要超过最大长度32位"}
                            ]
                        })(
                            <Select>
                                <Option value ="1">销售出库</Option>
                                <Option value ="2">领料出库</Option>
                                <Option value ="3">调拨出库</Option>
                                <Option value ="4">其它出库</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='上级单据编号' key='sourceCode'>
                        {getFieldDecorator('sourceCode', {
                            initialValue: modalData['sourceCode']?modalData['sourceCode'].value:null,
                            rules: [
                                {max: 64, message: "请不要超过最大长度64位"}
                            ]
                        })(input)}
                    </FormItem>
                    <FormItem hasFeedback {...formItemLayout} label='出货仓库' key='warehouseId'>
                        {getFieldDecorator('warehouseId', {
                            initialValue: modalData['warehouseId']?modalData['warehouseId'].value:null,
                            rules: [
                                {required: true, message: "请选择出货仓库", whitespace: true},
                            ]
                        })(
                            <Select>
                                {whIdData}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const ModalForm1 = Form.create()(ModalForm);
export default ModalForm1