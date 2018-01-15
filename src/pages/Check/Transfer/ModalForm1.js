import React, {Component} from 'react';
import {Form, Input, Modal,Select} from 'antd';
import axios from 'axios';
import checkCode from '../../../config/codeTips';
const Option = Select.Option;
const FormItem = Form.Item;

class ModalForm extends Component {
    state = {
        whIdData: [],
        CodeData:[],
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
    };
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
    onChange=(value)=>{
        axios({
            url:'/warehouse_slot_code/'+value,
            method:'get'
        }).then(res=>{
            const data=res.data.data;
            let CodeData=[];
            data.map(item=>{
                CodeData.push(<Option value={item} key={item}>{item}</Option>)
            });
            this.setState({
                CodeData
            })

        })
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const {whIdData,CodeData}=this.state;
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
        const input = <Input autoComplete="off"/>;
        return (
            <Modal visible={this.props.visible} title={'新增移库单'} onCancel={this.props.onCancel} onOk={this.handleSubmit}>
                <Form>
                    <FormItem hasFeedback {...formItemLayout} label='转移仓库' key='whId'>
                        {getFieldDecorator('whId', {
                            rules: [
                                {required: true, message: "请选择转移仓库", whitespace: true},
                            ]
                        })(
                            <Select onChange={this.onChange}>
                                {whIdData}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem hasFeedback {...formItemLayout} label='原库位' key='sourceCode'>
                        {getFieldDecorator('sourceCode', {
                            rules: [
                                {required: true, message: "请选择原库位", whitespace: true},
                            ]
                        })(
                            <Select
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {CodeData}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem hasFeedback {...formItemLayout} label='转移库位' key='targetCode'>
                        {getFieldDecorator('targetCode', {
                            rules: [
                                {required: true, message: "请选择转移库位", whitespace: true},
                            ]
                        })(
                            <Select
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {CodeData}
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