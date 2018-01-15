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

           values[key] = encodeURI(values[key].trim());

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
  handleSelect = (value)=>{
    this.props.form.setFieldsValue({"type":value})
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
        {title:"仓库名称",dataIndex:"name",key:"name"},
        {title:"仓库编号",dataIndex:"code",key:"code"},
        {title:"仓库类型",dataIndex:"type",key:"type"},
    ];
    if(keys){

      for (let i = 0; i < keys.length; i++) {
        let input = <Input autoComplete="off" />;
        if(keys[i].dataIndex == "type"){
          input = (
              <Select onSelect={this.handleSelect}>
                <Option value = "1">成品仓</Option>
                <Option value = "2">饰品仓</Option>
                <Option value = "3">木材仓</Option>
                <Option value = "4">五金仓</Option>
              </Select>
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