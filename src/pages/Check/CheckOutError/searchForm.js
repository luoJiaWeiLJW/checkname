import React, {Component} from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


class AdvancedSearchForm extends React.Component {

  handleSearch = (e) => {
      if(e){
          e.preventDefault();
      }
    this.props.form.validateFields((err, values) => {

      Object.keys(values).forEach(key =>{
        if(values[key]){
          if(key === "voucherDate"){
            values[key] = values[key].format("YYYY-MM-DD");
          }else{
            values[key] = encodeURI(values[key].trim())
          }

        }else{
          values[key] = ""
        }

      })
      this.props.onSearch(values)
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.handleSearch();
  }
    handleSelect = (value) =>{
        this.props.form.setFieldsValue({status:value});
        this.handleSearch();
    }
    handleChange = (value) =>{
        this.props.form.setFieldsValue({voucherDate:value});
        this.handleSearch();
    }

 

  // To generate mock Form.Item
  getFields = () => {
   
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const children = [];
    const keys = [
        {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate"},
        {title:"出库单编号",dataIndex:"outCode",key:"outCode"},

    ];
    if(keys){

      for (let i = 0; i < keys.length; i++) {
        let input = <Input autoComplete="off" />;
        if(keys[i].dataIndex ==="voucherDate"){
          input = <DatePicker format ="YYYY-MM-DD" style={{width:"100%"}} onChange={this.handleChange}/>
        }if(keys[i].dataIndex === "state"){
          input = (
              <Select onSelect={this.handleSelect}>
                <Option value ="0">未处理</Option>
                <Option value ="1">已处理</Option>
              </Select>
          )
        }
      children.push(
        <Col lg={8} xl={6} key={i}>
          <FormItem {...formItemLayout} label={keys[i].title}>
            {getFieldDecorator(keys[i].dataIndex)(input)}
          </FormItem>
        </Col>
      );
    }
        const xl = (4 - keys.length % 4) * 6;
        const lg = (3 - keys.length % 3) * 8;
        children.push(
            <Col xl={xl} lg={lg} style={{textAlign:'right'}} key="btn">
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    清空
                </Button>
            </Col>
        )

    }
   
    return children;
  }

  render() {


    
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
            {this.getFields()}
        </Row>

      </Form>
    );

  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
export default WrappedAdvancedSearchForm