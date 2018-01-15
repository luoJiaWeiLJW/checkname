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
            if(key === "createTime"){
                values[key] = values[key].format("YYYY-MM-DD");
            }else{
                values[key] = encodeURI(values[key].trim());
            }
        }else{
          values[key] = ""
        }
        
      })
      this.props.onSearch(values)
    });
  }
    handleChange = (value) =>{
        this.props.form.setFieldsValue({createTime:value});
        this.handleSearch();
    }
  handleReset = () => {
    this.props.form.resetFields();
    this.handleSearch();
  }
  handleSelect = (value)=>{
    this.props.form.setFieldsValue({"state":value})
    this.handleSearch()
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
        {title:"制单时间",dataIndex:"createTime",key:"createTime"},
        {title:"单据编号",dataIndex:"code",key:"code"},
        {title:"状态",dataIndex:"state",key:"state"},
    ];
    if(keys){

      for (let i = 0; i < keys.length; i++) {
        let input = <Input autoComplete="off" />;
        if(keys[i].dataIndex == "state"){
          input = (
              <Select onSelect={this.handleSelect}>
                <Option value = "0">未执行</Option>
                <Option value = "1">已执行</Option>
              </Select>
          )
        }else if (keys[i].dataIndex == "createTime"){
            input = (
                <DatePicker onChange = {this.handleChange} style={{width:"100%"}}/>
            )
        }
      children.push(
        <Col xl={6} lg={8} key={i}>
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
        <Row gutter={40}>{this.getFields()}
        </Row>
      </Form>
    );

  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
export default WrappedAdvancedSearchForm