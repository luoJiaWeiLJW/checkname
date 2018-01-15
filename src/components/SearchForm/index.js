import React, {Component} from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import "./style.css";
const FormItem = Form.Item;




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


 

  // To generate mock Form.Item
  getFields = ()=> {
   
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const children = [];
    const keys = this.props.searchKeys;
    if(keys){
       for (let i = 0; i < keys.length; i++) {
      children.push(
        <Col xl={6} lg={8} key={i}>
          <FormItem {...formItemLayout} label={keys[i].title}>
            {getFieldDecorator(keys[i].dataIndex)(
              <Input autoComplete="off" />
            )}
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
    if(this.props.searchKeys){

    
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}
        </Row>
      </Form>
    );
    }else{
      return "";
    }
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
export default WrappedAdvancedSearchForm