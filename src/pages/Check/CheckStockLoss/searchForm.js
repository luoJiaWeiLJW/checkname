import React, {Component} from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker,Select,message } from 'antd';
import checkCode from "../../../config/codeTips";
import axios from "axios";
const FormItem = Form.Item;
const Option = Select.Option;




class AdvancedSearchForm extends React.Component {
  state = {
    dataSource:[]
  }
  componentDidMount () {
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
  handleSearch = (e) => {
      if(e){
          e.preventDefault();
      }

    this.props.form.validateFields((err, values) => {

      Object.keys(values).forEach(key =>{
        if(values[key]){
          if(key === "takeStockTime"){
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
        this.props.form.setFieldsValue({warehouseId:value});
        this.handleSearch();
    }
    handleChange = (value) =>{
        this.props.form.setFieldsValue({takeStockTime:value});
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
    const keys = [
        {title:"截止日期",dataIndex:"takeStockTime",key:"takeStockTime"},
        {title:"盘点单号",dataIndex:"takeStockCode",key:"takeStockCode"},
        {title:"盘点仓库",dataIndex:"warehouseId",key:"warehouseId"},
    ];
    if(keys){

      for (let i = 0; i < keys.length; i++) {
        let input = <Input autoComplete="off" />;
        if(keys[i].dataIndex ==="takeStockTime"){
           input = <DatePicker format ="YYYY-MM-DD" style={{width:"100%"}} onChange={this.handleChange}/>
        }if(keys[i].dataIndex === "warehouseId"){

          const Options = this.state.dataSource.map((item) =>{
              return <Option value = {item.value} key={item.value}>{item.name}</Option>
          })
          input = (
              <Select onSelect={this.handleSelect}>
                  {Options}
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