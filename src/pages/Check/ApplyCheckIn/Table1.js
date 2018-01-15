import React, {Component} from 'react';
import { Table, Badge, Button, Popconfirm, message,Tooltip} from 'antd';
import ModalForm from './ModalForm1';
import Table2 from './Table2.js';
import axios from 'axios';
import './style.css';
import SearchForm from './searchForm';
import checkCode from '../../../config/codeTips.js';

class BasicTable extends Component{
    constructor(props){
        super(props);
        const dataSource = [];//表格数据源
        const visible = false;//模态框显示隐藏
        const modalData = {
            voucherDate:{value:"",title:"制单日期"},
            intoCode:{value:"",title:"单据编号"},
            carNumber:{value:"",title:"车牌号"},
            provideGroupId:{value:"",title:"交货部门"},
            provideUserId:{value:"",title:"交货人员"},
            warehouseId:{value:"",title:"收货仓库"},
            consigneeUserId:{value:"",title:"收货人员"},
            logisticsCompany:{value:"",title:"物流公司"},

        };//模态框所需数据,value为值,title为每一个表单项标题
        const modalType = "";//add 或 edit
        const editIndex = -1;//当前编辑项,详见handleOk函数里当modalType='edit'时对dataSource的处理
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};
        const loading = false;
        const modalTitle="入库申请单";
        const searchData = {};//搜索参数如'/stores?status=1'里的status就是搜索参数,searchData从<SearchForm/>里获取
        const sorter = {order:""};//排序参数,如按日期排序'/stores?sortField=voucherDate&sortOrder=A'
        const modalKey = "";//模态框的key值,当key不同时,每次出现的模态框都是新的,不会与旧数据发生关联
        const total = 0;
        this.state={pagination,loading,dataSource,visible,modalData,modalType,editIndex,modalTitle,searchData,sorter,modalKey,total};
        //初始化columns
        const columns = [
            {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate",sorter:true},
            {title:"单据编号",dataIndex:"intoCode",key:"intoCode"},
            {title:"车牌号",dataIndex:"carNumber",key:"carNumber"},
            {title:"交货部门",dataIndex:"provideGroupName",key:"provideGroupName"},
            {title:"交货人员",dataIndex:"provideUserName",key:"provideUserName"},
            {title:"收货仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"收货人员",dataIndex:"consigneeUserName",key:"consigneeUserName"},
            {title:"物流公司",dataIndex:"logisticsCompany",key:"company"},

        ]

        columns.push({
            title:"状态",dataIndex:"status",key:"status",width:"10%",className:"row-status",render:(text,record)=>{
              //text代表值,record代表这一行数据,index是数据的索引值  
                let result = "";
                switch (text){
                    case '-1':result = <span><Badge status="default" />提交失败<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.upload(record)}}></Button></Tooltip></span>;break;
                    case '0':result = <span><Badge status="default" />未提交<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.upload(record)}}></Button></Tooltip></span>;break;
                     case '1':result = <span><Badge status="processing" />提交中<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.upload(record)}}></Button></Tooltip></span>;break;
                    // case '2':result = <span><Badge status="processing" />分配库位中<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.upload(record)}}></Button></Tooltip></span>;break;
                    // case '3':result = <span><Badge status="processing" />分配完成</span>;break;
                    case '4':result = <span><Badge status="processing" />待入库</span>;break;
                    case '5':result = <span><Badge status="success" />已完成</span>;break;
                    default:break;
                }
                return result;
            }
        })
        columns.push({
            title:"操作",key:"operation",width:"10%",render:(text,record,index)=>{
                
                let result = (   
                    <span>
                        <Button size="small" type="primary" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button size="small" type="danger" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    </span>
                )
                switch (record.status){//status为0时代表未提交,这行数据可以进行编辑删除,如果已提交,status为1或更高,就不能进行编辑删除  
                    case "-1":break;   // status 为 -1  提交失败 数据可更改 （状态更改）
                    case "0":break;
                    default:result = "";break;
                }
                return result;    
                
            }
        })
        this.columns = columns;

    }

    handleSearch = (data) =>{//按条件搜索
        const {pagination} = this.state;
        pagination.current = 1;
        pagination.total=0;
        this.setState({
            searchData:data,
            pagination
        })
        this.axios({
            ...data,
            pagesize:this.state.pagination.pagesize||10,
            pageindex:1,
            sortField:this.state.sorter.field,
            sortOrder:this.state.sorter.order
        });
    }
    handleTableChange = (pagination, filters, sorter) => {//当切换分页(current)或调整每页条数(pageSize)或filters,sorter变化时触发该函数
        const pager = { ...this.state.pagination };
        let pageindex = 1;
        if(sorter.field != this.state.sorter.field){
            pageindex = 1;
        }else{
            pageindex = pagination.current
        }
        pager.current = pageindex;
        pager.pagesize = pagination.pageSize;

        const sort = {};
        sort.field = sorter.field ;
        sort.order = sorter.order ;
        this.setState({
            pagination: pager,
            sorter:sort
        });

        const searchData = this.state.searchData;
        setTimeout(()=>{
            this.axios({
                pagesize: pagination.pageSize,
                pageindex,
                sortField:sorter.field,
                sortOrder: sorter.order,
                ...filters,
                ...searchData
            });
        },0)


    }
    axios = (params = {}) =>{

        this.setState({ loading: true});
        if(params.sortOrder){
            if(params.sortOrder instanceof Array){
                params.sortOrder=params.sortOrder.map(item=>{
                    return item=="ascend"?"A":"D";//组件默认是ascend或descend,但接口需要传递A或D
                })
            }else{
                params.sortOrder = params.sortOrder == "ascend"?"A":"D";
            }

        }
        axios({
            url:"/stores",
            method:"get",
            params:{
                pagesize:10,
                ...params
            }

        }).then(res =>{
            if(!checkCode(res.data.code)){
                const pagination = {...this.state.pagination};
                pagination.total=0;
                if(res.data.code == "607"){
                    this.setState({
                        loading:false,
                        dataSource:[],
                        pagination
                    })
                }else{
                    this.setState({pagination,loading:false,dataSource:[]})
                }
                return
            }
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data
            }
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;//设置pagination的total属性很重要,这样pagination组件才能根据total和pageSize计算出需要几个分页

            this.setState({
                pagination,
                loading:false,
                dataSource:dataSource,
            })
        }).catch(e=>{
            this.setState({loading:false})
            message.error("系统出错,请重新尝试")})
    }
    componentDidMount() {
        this.axios({pageindex:1});
    }
    handleChangeTotal =(total)=>{//该处理函数可以废除
        this.setState({total:total})
    }
    upload = (record) =>{//提交
        axios.get("/store/"+record.intoCode+"/items")
            .then(res =>{ //先判断入库申请单对应的单项是否数量为0,大于0时才能提交
                if(res.data.data instanceof Array && res.data.data.length>0){
                    axios({
                        url:"/store/"+record.intoCode+"/status/"+"4",
                        method:"put"
                    }).then(res => {
                        const code = res.data.code;
                        if(code =="200"||code=="201"||code=="203"||code=="204") {
                            message.success("提交成功")
                            record.status = "4";
                            this.setState({
                                dataSource:this.state.dataSource
                            })
                            return;
                        }else{
                            message.warning("提交失败");
                        }

                    }).catch(e => {
                        message.error("系统出错,请重新尝试")
                    })
                }
                else{
                    message.warning("请添加货品后再提交")
                }

            })


    }

    onDelete = (record) =>{
        const {searchData,pagination,sorter}= this.state;
        axios({
            url:"/store/"+record.id,
            method:"delete"

        }).then(res=>{
            if(!checkCode(res.data.code))return;
            this.axios({
                pageindex:pagination.current||1,
                pagesize:pagination.pagesize||10,
                ...searchData,
                sortField:sorter.field,
                sortOrder:sorter.order
            })
        }).catch(e=>{
            message.error("系统出错,请重新尝试")
        })


    }
    showModal = (type,record) => {
        const {modalData} = this.state;
        Object.keys(modalData).forEach(key =>{
            if(type == "edit"){modalData[key].value = record[key]}
            if(type == "add"){modalData[key].value = ""}
        })
        let modalTitle = "入库申请单";
        if(type == "add"){modalTitle = "新增入库申请单"}
        if(type == "edit"){modalTitle = "修改入库申请单"}

        let editIndex = -1;
        this.state.dataSource.forEach((item,index)=>{
            if(item === record){editIndex = index}
        })
        const modalKey = new Date().toUTCString()+Math.random();
        this.setState({
            modalType:type,
            visible:true,
            modalData,
            modalTitle,
            editIndex,
            modalKey
        })


    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            axios({
                url:"/store",
                method:"post",
                data:{
                    carNumber:data.carNumber,
                    provideGroupId:data.provideGroupId,
                    provideUserId:data.provideUserId,
                    warehouseId:data.warehouseId,
                    consigneeUserId:data.consigneeUserId,
                    logisticsCompany:data.logisticsCompany,

                }
            }).then(res=>{
                if(!checkCode(res.data.code))return;
                const {searchData,pagination,sorter}= this.state;
                this.axios({
                    pageindex:this.state.pagination.current||1,
                    pagesize:pagination.pagesize||10,
                    ...searchData,
                    sortField:sorter.field,
                    sortOrder:sorter.order
                })
            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })

        }else if(this.state.modalType === "edit"){

            axios({
                url:"/store/"+this.state.dataSource[this.state.editIndex].id,
                method:"put",
                data:{
                    voucherDate:data.voucherDate,
                    intoCode:data.intoCode,
                    carNumber:data.carNumber,
                    provideGroupId:data.provideGroupId,
                    provideUserId:data.provideUserId,
                    warehouseId:data.warehouseId,
                    consigneeUserId:data.consigneeUserId,
                    logisticsCompany:data.logisticsCompany,

                }
            }).then(res =>{
                if(!checkCode(res.data.code))return;
                const {dataSource} = this.state;
                Object.keys(data).forEach(key=>{   //页面内刷新数据,后续可以改为再调用一次axios刷新数据
                    dataSource[this.state.editIndex][key] = data[key]
                })
                this.setState({dataSource})

            }).catch(e=>{
                message.error("系统出错,请重新尝试")
            })

        }


    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render = ()=> {
        //表格的每一行展开项
        const expandedRowRender = (record) =>{

            return <Table2 status={record.status} code = {record.intoCode} whId={record.warehouseId} handleChangeTotal ={this.handleChangeTotal}/>
        }

        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Button className='table-add-btn' onClick={()=>{this.showModal("add")}} type="primary">增加</Button>
                <Table  expandedRowRender={expandedRowRender} className="components-table-nested" columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={record => record.id||record.intoCode}  dataSource ={this.state.dataSource}/>
                <ModalForm key={this.state.modalKey} modalType={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}/>
            </div>

        )

    }



}
export default BasicTable;