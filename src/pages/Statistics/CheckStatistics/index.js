import React,{Component} from 'react';
import BreadcrumbCustom from '../../../components/BreadcrumbCustom';
import RechartsLineChart from './RechartsLineChart';
import RechartsBarChart from './RechartsBarChart';
import RechartsPieChart from './RechartsPieChart';
import {Row,message,Col,Tabs,Card,Radio,Table,Input,Form,InputNumber,Select,DatePicker,Switch,Button,Tooltip,Icon} from  "antd";
import "../../../style/lib/animate.css";
import axios from 'axios';
import checkCode from '../../../config/codeTips';
import moment from 'moment';
const {RangePicker,MonthPicker} = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

function disabledDate(current){
    return current && current.valueOf() >= Date.now();
}
function getMaxYear(){
    return new Date().getFullYear();
}

function getMaxQuater(){
    const month = new Date().getMonth();
    return Math.floor(month/3)+1
}

class SearchForm extends Component{
    state = {
        goodsType:"1",//单一物料or全部物料
        goodsCode:"",//物料编码
        timeType:"1",//时间选择类型
        monthPicker:moment(),//月份选择器的值(2015-05)
        _year:2017,//年
        quarter:"",//季度
        year:"2017",//年份
        range:[],//时间段选择器的值
        store:'0',//仓库类型 1 2 3 4
        onlyChange:false,
        tipVisible:false,
        tipTitle:"",
        stores:[{'id':'0','name':'全部仓库'}],//所有仓库
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
        const {goodsType,goodsCode,timeType,monthPicker,quarter,year,range,store,onlyChange,_year}=this.state;
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
            if(goodsCode.trim()===""){
                this.setState({
                    tipTitle:"请输入物料编码",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            params= {...params,goodsCode};
        };
        if(timeType === ""){
            this.setState({
                tipTitle:"请选择时间",
                tipVisible:true
            })
            setTimeout(()=>{this.setState({tipVisible:false})},1000)
            return;
        }
        if(timeType === "1"){
            if(monthPicker === ""){
                this.setState({
                    tipTitle:"请选择月份",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            const month = monthPicker.format("YYYY-MM");

            params = {...params,month,timeType};

        }
        if(timeType === "2"){
            if(year === ""){
                this.setState({
                    tipTitle:"请选择年份",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            if(quarter === ""){
                this.setState({
                    tipTitle:"请选择季度",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            params = {...params,quarter,year,timeType};

        }
        if(timeType === "3"){
            if(_year === ""){
                this.setState({
                    tipTitle:"请选择年份",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            const year = _year;
            params = {...params,year,timeType};

        }
        if(timeType === "4"){
            if(range.length === 0){
                this.setState({
                    tipTitle:"请选择时间段",
                    tipVisible:true
                })
                setTimeout(()=>{this.setState({tipVisible:false})},1000)
                return;
            }
            const startTime = range[0].format("YYYY-MM-DD");
            const endTime = range[1].format("YYYY-MM-DD");
            params = {...params,startTime,endTime,timeType};

        }
        if(store === ""){
            this.setState({
                tipTitle:"请选择仓库",
                tipVisible:true
            })
            setTimeout(()=>{this.setState({tipVisible:false})},1000)
            return;
        }
        params = {...params,store:store === '0' ? null : store,onlyChange};
        axios({
            url:"/stat/statistics",
            method:'get',
            params:params
        }).then(res =>{
            if(res.data.code !=="200"){
                message.warning("查询结果为空")
                this.props.onSubmit([]);
                return;
            }
            if(res.data.data instanceof Array){
                const data = res.data.data.map(item =>{
                    return{
                        name:item.material?item.material.name:"-",
                        code:item.material?item.material.code:"-",
                        pack:item.pack?item.pack.name:"-",
                        standard:item.material?item.material.standard:"-",
                        expirationDate:item.material?item.material.expirationDate:"-",
                        qr:item.material?item.material.qr:"-",
                        inTimes:item.material?item.inTimes:"-",
                        inNumber:item.material?item.inNumber:"-",
                        outTimes:item.material?item.outTimes:"-",
                        outNumber:item.material?item.outNumber:"-",
                        beginInventory:item.beginInventory?item.beginInventory:"-",
                        endInventory:item.endInventory?item.endInventory:"-",
                        loss:item.loss,
                        surplus:item.surplus,
                    }

                });
                this.props.onSubmit([]);
                this.props.onSubmit(data);
            }
        }).catch(e =>{message.error("系统出错,请重新尝试")})

    }


    handleInputChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSelectChange = (value)=>{
        this.setState({quarter:value})
    }
    handleYearChange = (value) =>{
        this.setState({year:value})
        if(value == getMaxYear() && parseInt(this.state.quarter)>=getMaxQuater()){
                this.setState({quarter:getMaxQuater()+""})
        }
    }
    handle_YearChange = (value) =>{
        this.setState({_year:value})
    }
    handleMonthChange = (value) =>{
        this.setState({monthPicker:value})
    }
    handleRangeChange = (value) =>{
        this.setState({range:value})
    }
    handleStoreChange = (value) =>{
        this.setState({store:value})
    }
    handleOnlyChange = (value) =>{
        this.setState({onlyChange:value})
    }
    render = ()=> {
        const radioStyle = {
            display: 'block',
            lineHeight: '30px',
            width:"60px"
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 20,
                    offset: 4,
                },
            },
        };
        const year = parseInt(this.state.year);
        function seasonDisabled(current){
            return !(year<getMaxYear()||(current<=getMaxQuater()))
        }
        const seasonOptions = [
            <Option value="1" key="1" disabled={seasonDisabled(1)}>一</Option>,
            <Option value="2" key="2" disabled={seasonDisabled(2)}>二</Option>,
            <Option value="3" key="3" disabled={seasonDisabled(3)}>三</Option>,
            <Option value="4" key="4" disabled={seasonDisabled(4)}>四</Option>
        ]
        return (

                <Form onSubmit={this.handleSubmit} style={{width:300}}>
                    <FormItem {...formItemLayout} label="货品" key="1">
                        <RadioGroup onChange = {this.handleInputChange} value = {this.state.goodsType}>
                            <Radio style={radioStyle} value="1" name="goodsType">全部物料</Radio>
                            <Radio style={radioStyle} value="2" name="goodsType">
                                单一物料<br/>{this.state.goodsType === "2" ? (<Input placeholder="请输入物料编码" style={{ width: 100}} name="goodsCode" onChange={this.handleInputChange} value = {this.state.goodsCode} autoComplete="off"/> ): null}
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="时间" key="2">
                        <RadioGroup onChange = {this.handleInputChange} value = {this.state.timeType} name="goodsType">
                            <Radio style={radioStyle} value="1" name="timeType" key="1">
                                月<br/>{this.state.timeType === "1" ?<MonthPicker style={{width:200}} value = {this.state.monthPicker} onChange = {this.handleMonthChange} disabledDate={disabledDate}/>: null}
                            </Radio>
                            <Radio style={radioStyle} value="2" name="timeType" key="2">
                                季度<br/>{this.state.timeType === "2" ? (<span><InputNumber onChange={this.handleYearChange} value = {this.state.year} precision={0} max={getMaxYear()}/>年<Select style={{width:50,marginLeft:10}} value = {this.state.quarter} onChange={this.handleSelectChange}>{seasonOptions}</Select>季度</span> ): null}
                            </Radio>
                            <Radio style={radioStyle} value="3" name="timeType" key="3">
                                年<br/>{this.state.timeType === "3" ?<span><InputNumber onChange={this.handle_YearChange} value = {this.state._year} precision={0} max={getMaxYear()}/>年</span> : null}
                            </Radio>
                            <Radio style={radioStyle} value="4" name="timeType" key="4">时间段<br/>{this.state.timeType === "4" ? <RangePicker style={{width:200}} onChange={this.handleRangeChange} value={this.state.range} disabledDate={disabledDate}/>: null}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="仓库"  key="3">
                        <Select onChange={this.handleStoreChange} value = {this.state.store} style={{width:200}}>
                            {this.state.stores.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem {...formItemLayout} label="内容"  key="4">
                        <Switch value={this.state.onlyChange} onChange={this.handleOnlyChange} checkedChildren={'是'} unCheckedChildren={'否'} style={{marginRight:10}}/>
                        仅显示本期有变化的商品
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
            {title:"物料信息",children:[
                {title:"物料名称",dataIndex:"name",key:"name"},
                {title:"物料编码",dataIndex:"code",key:"code"},
                {title:"型号规格",dataIndex:"standard",key:"standard"},
                {title:"包装",dataIndex:"pack",key:"pack"},
                {title:"保质期",dataIndex:"expirationDate",key:"expirationDate"},
                {title:"质量要求",dataIndex:"qr",key:"qr"},
            ]},
            {title:"本期入库",children:[
                {title:"次数",dataIndex:"inTimes",key:"inCounter"},
                {title:"数量",dataIndex:"inNumber",key:"inAmount"},
            ]},
            {title:"本期出库",children:[
                {title:"次数",dataIndex:"outTimes",key:"outCounter"},
                {title:"数量",dataIndex:"outNumber",key:"outAmount"},
            ]},
            {title:"本仓库期初库存",dataIndex:"beginInventory",key:"thisStartStock"},
            {title:"本仓库期末库存",dataIndex:"endInventory",key:"thisEndStock"},
            {title:"本期盘亏",dataIndex:"loss",key:"loss"},
            {title:"本期盘盈",dataIndex:"surplus",key:"surplus"},
        ];
            return <Table columns={columns} dataSource={this.props.dataSource} pagination={pagination}  rowClassName={(record, index) =>  'animated fadeInRight'} bordered rowKey={record => record.code}/>
    }

}


class CheckStatistics extends  Component {
    state = {
        dataSource:[]
    }
    handleSubmit = (data) => {
        this.setState({dataSource:data})

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
                <BreadcrumbCustom first="统计分析" second="出入库统计表"  />
                <Row gutter={16}>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:550,marginBottom:20}} title="表格统计">
                                 <StatisticsTable dataSource = {this.state.dataSource}/>
                            </Card>
                            <Card bordered={false} style={{minHeight:550}} title="图表统计">
                                <Tabs defaultActiveKey="1" >
                                    <TabPane tab={<span><Icon type="bar-chart"/>柱状图</span>} key="1"><RechartsBarChart data={dataSource}/></TabPane>
                                    <TabPane tab={<span><Icon type="pie-chart"/>饼状图</span>} key="2"><RechartsPieChart data01={data01} data02={data02}/></TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{minHeight:550}} title="选择条件" id="conditionsCard">
                                <SearchForm onSubmit = {this.handleSubmit}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export  default CheckStatistics;
