import React,{Component} from 'react';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import Qs from 'qs';
import RechartsLineChart from './RechartsLineChart';
import RechartsBarChart from './RechartsBarChart';
import RechartsPieChart from './RechartsPieChart';
import {Row,message,Col,Tabs,Card,Radio,Table,Input,Form,Slider,Select,DatePicker,Switch,Button,Tooltip,Icon,Tag} from  "antd";
import "../../../style/lib/animate.css";
import axios from 'axios';
import checkCode from '../../../config/codeTips';
import moment from 'moment';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class SearchForm extends Component{
    state = {
        goodsType:"1",//单一物料or全部物料
        materialCode:[],
        slideValue:[3,7],
        store:"0",//仓库类型 1 2 3 4 全部仓库"0"
        inputVisible:false,
        inputValue:"",
        tipVisible:false,
        tipTitle:"",
        stores:[{'id':'0',name:'全部仓库'}]
    }

    componentDidMount () {
        axios.get("/warehouses")
            .then(res => {
                if(res.data.code !== '200'){
                    message.warning("查询不到仓库信息")
                    return
                }
                if(res.data.data instanceof Array){
                    this.setState({stores:[{'id':'0','name':'全部仓库'},...res.data.data]},this.handleSubmit)
                }
            })
            .catch(e => message.error("系统出错,请重新尝试"))
    }
    handleSubmit =  (e) =>{
        if(e){
            e.preventDefault();
        }

        let params = {};
        const {goodsType,store,materialCode,slideValue}=this.state;
        if(slideValue[0] === 0 || (slideValue[0]===slideValue[1])){
            this.setState({
                tipTitle:"账龄分组间隔至少为1天",
                tipVisible:true
            })
            setTimeout(()=>{this.setState({tipVisible:false})},1000)
            return;
        }
        if(goodsType === ""){
            this.setState({
                tipTitle:"请选择物料",
                tipVisible:true
            })
            setTimeout(()=>{this.setState({tipVisible:false})},1000)
            return;
        }
        if(goodsType === "1"){};
        if(goodsType === "2"){
            if(materialCode.length == 0){
                this.setState({
                    tipTitle:"请至少选择一项物料",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
        };
        if(store === ""){
            this.setState({
                tipTitle:"请选择仓库",
                tipVisible:true
            })
            setTimeout(()=>{this.setState({tipVisible:false})},1000)
            return;
        }
        if(store === "0"){
            params = {
                interval1:slideValue[0],
                interval2:slideValue[1]-slideValue[0],
            }
        }else{
            params = {
                interval1:slideValue[0],
                interval2:slideValue[1]-slideValue[0],
                store,
            }
        }


        const titles = [];
        titles[0] = "0天至"+slideValue[0]+"天";
        titles[1] = slideValue[0]+"天至"+slideValue[1]+"天";
        titles[2] = slideValue[1]+"天以上";
        axios({
            url:"/stat/indays",
            method:'get',
            params:params,
            paramsSerializer: function(params){
                let _params = Qs.stringify(params);
                if(goodsType == "2"){
                    materialCode.forEach(item =>{
                        _params+=("&materialCode="+encodeURI(encodeURI(item.trim())))
                    })
                }
                return _params
            },

        }).then(res =>{
            if(!checkCode(res.data.code)){
                this.props.onSubmit([],[]);
                return;
            }
            if(res.data.data instanceof Array){
                const data = res.data.data.map(item =>{
                    return{
                        name:item.material?item.material.name:"-",
                        code:item.material?item.material.code:"-",
                        standard:item.material?item.material.standard:"-",
                        pack:item.packing?item.packing.name:"-",
                        total:item.total||"-",
                        areaNum1:item.areaNum1||"-",
                        areaNum2:item.areaNum2||"-",
                        areaNum3:item.areaNum3||"-",
                    }
                });
                this.props.onSubmit([],[]);
                this.props.onSubmit(data,titles);
            }
        }).catch(e =>{message.error("系统出错,请重新尝试")})

    }

    handleStoreChange = (value) =>{
        this.setState({store:value})
    }
    handleRadioChange = (e) =>{
        this.setState({goodsType:e.target.value})
    }
    handleClose = (removedTag) => {
        const materialCode = this.state.materialCode.filter(tag => tag !== removedTag);
        this.setState({ materialCode });
    }
    showInput = () => {
        this.setState({ inputVisible: true });
        setTimeout(function(){
            document.getElementById("codeInput").focus()
        },0)
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let materialCode = state.materialCode;
        if (inputValue && materialCode.indexOf(inputValue) === -1) {
            materialCode = [...materialCode, inputValue];
        }
        this.setState({
            materialCode,
            inputVisible: false,
            inputValue: '',
        });
    }

    render = ()=> {
        const radioStyle = {
            display: 'block',
            lineHeight: '30px',
            width:"60px"
        };
        const formItemLayout = null;
        const tailFormItemLayout = null;
        const marks = {
            0: '0天',
            20: {
                style: {
                    color: '#f50',
                },
                label: <strong>20天以上</strong>,
            },
        };
        const { materialCode, inputVisible, inputValue } = this.state;
        return (

                <Form onSubmit={this.handleSubmit} layout="vertical">
                    <FormItem {...formItemLayout} label="日期"  key="1">
                        {moment().format("YYYY-MM-DD")}
                    </FormItem>
                    <FormItem {...formItemLayout} label="账龄分组"  key="2">
                        <Slider range marks={marks} included={false}  max={20} value={this.state.slideValue} onChange={value => {this.setState({slideValue:value})}}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="物料选择"  key="3">
                        <RadioGroup onChange = {this.handleRadioChange} value = {this.state.goodsType}>
                            <Radio style={radioStyle} value="1" name="goodsType">全部物料</Radio>
                            <Radio style={radioStyle} value="2" name="goodsType">
                                自定义物料
                            </Radio>
                            {this.state.goodsType === "2" ? (
                                <div>
                                    {materialCode.map((tag, index) => {
                                        const isLongTag = tag.length > 20;
                                        const tagElem = (
                                            <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                            </Tag>
                                        );
                                        return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
                                    })}
                                    {inputVisible && (
                                        <Input
                                            id="codeInput"
                                            type="text"
                                            size="small"
                                            style={{ width: 120 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                            placeholder="请输入物料编码"
                                        />
                                    )}
                                    {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 新物料</Button>}
                                </div>
                            ): null}
                        </RadioGroup>
                    </FormItem>

                    <FormItem {...formItemLayout} label="仓库"  key="4">
                        <Select onChange={this.handleStoreChange} value = {this.state.store} style={{width:200}}>
                            {this.state.stores.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem {...tailFormItemLayout}  key="5">
                        <Tooltip title={this.state.tipTitle} visible={this.state.tipVisible} getPopupContainer={()=>document.getElementById("sbmButton")} placement="rightTop">
                            <Button type="primary" htmlType="submit" size="large" id="sbmButton">查询</Button>
                        </Tooltip>
                    </FormItem>
                </Form>


        )
    }
}

class StatisticsTable extends Component {

    render () {
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const columns = [
            {title:"物料名称",dataIndex:"name",key:"name"},
            {title:"物料编码",dataIndex:"code",key:"code"},
            {title:"型号规格",dataIndex:"standard",key:"standard"},
            {title:"包装",dataIndex:"pack",key:"pack"},
            {title:"库存数量",dataIndex:"total",key:"total"},
        ];
        if(this.props.titles.length !== 0){
            columns.push({title:this.props.titles[0],dataIndex:"areaNum1",key:"areaNum1"});
            columns.push({title:this.props.titles[1],dataIndex:"areaNum2",key:"areaNum2"});
            columns.push({title:this.props.titles[2],dataIndex:"areaNum3",key:"areaNum3"});
        }
            return <Table columns={columns} dataSource={this.props.dataSource} pagination={pagination}  rowClassName={(record, index) =>  'animated fadeInRight'} bordered rowKey={record => record.code}/>
    }

}


class AgeStatistics extends  Component {
    state = {
        dataSource:[],
        titles:[]
    }
    handleSubmit = (data,titles) => {
        this.setState({dataSource:data,titles:titles})

    }
    render () {
        const dataSource = [...this.state.dataSource];
        const data01=[];
        const data02=[];
        dataSource.map(item =>{
            item["本仓库期初库存"]=parseFloat(item.beginInventory)||0;
            item["本仓库期末库存"]=parseFloat(item.endInventory)||0;
            data01.push({name:item.name,value:parseFloat(item.beginInventory)||0});
            data02.push({name:item.name,value:parseFloat(item.endInventory)||0});
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="统计分析" second="库存账龄统计表"  />
                <Row gutter={16}>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:650,marginBottom:20}} title="表格统计">
                                 <StatisticsTable dataSource = {this.state.dataSource} titles={this.state.titles}/>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:650}} title="选择条件" id="conditionsCard">
                                <SearchForm onSubmit = {this.handleSubmit}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export  default AgeStatistics;
