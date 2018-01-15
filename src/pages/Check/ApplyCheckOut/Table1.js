import React, {Component} from 'react';
import { message,Table, Badge, Menu, Dropdown, Icon, Upload, Button, Popconfirm,Tooltip} from 'antd';
import ModalForm from './ModalForm1';
import Table2 from './Table2.js';
import axios from 'axios';
import checkCode from '../../../config/codeTips';
import SearchForm from './searchForm';
class BasicTable extends Component{
    constructor(props){
        super(props);
        const dataSource = [];
        const visible = false;
        //模态层表单数据
        const modalData = {
            voucherDate:{value:"",title:"制单日期"},
            noticeNo:{value:"",title:"发货通知单号"},
            salesman:{value:"",title:"销售业务员"},
            locationId:{value:"",title:"购货单位"},
            name:{value:"",title:"名称"},
            address:{value:"",title:"地址"},
            principalName:{value:"",title:"负责人"},
            principalPhone:{value:"",title:"负责人电话"},
            postcode:{value:"",title:"邮编"},
            predictDeliverTime:{value:"",title:"预计发货时间"},
            warehouseId:{value:"",title:"出货仓库"},
            logisticsType:{value:"",title:"物流方式"},
            logisticsCompany:{value:"",title:"物流公司"},
        };
        const modalType = "";
        const editIndex = -1;
        const pagination = {showSizeChanger:true,showQuickJumper:true,showTotal:total =>'共 '+total+' 条'};//1
        const loading = false;
        const modalTitle = "出库申请单";
        const modalKey = "";
        const searchData ={};
        const sorter = {order:""};
        const total = 0;
        this.state={pagination,loading,dataSource,visible,modalData,modalType,editIndex,modalTitle,sorter,searchData,modalKey,total};
        //初始化columns
        const columns = [
            {title:"制单日期",dataIndex:"voucherDate",key:"voucherDate",sorter:true},
            {title:"购货单位",dataIndex:"name",key:"name"},
            {title:"负责人",dataIndex:"principalName",key:"principalName"},
            {title:"单据编号",dataIndex:"outCode",key:"outCode"},
            {title:"发货通知单号",dataIndex:"noticeNo",key:"noticeNo"},
            {title:"销售业务员",dataIndex:"salesman",key:"salesman"},
            {title:"地址",dataIndex:"address",key:"address"},
            {title:"负责人电话",dataIndex:"principalPhone",key:"principalPhone"},
            {title:"邮编",dataIndex:"postcode",key:"postcode"},
            {title:"预计发货时间",dataIndex:"predictDeliverTime",key:"predictDeliverTime",sorter:true},
            {title:"出货仓库",dataIndex:"warehouseName",key:"warehouseName"},
            {title:"物流方式",dataIndex:"logisticsType",key:"logisticsType"},
            {title:"物流公司",dataIndex:"logisticsCompany",key:"logisticsCompany"},
            {title:"制单部门",dataIndex:"outGroupName",key:"outGroupName"},
            {title:"制单人",dataIndex:"outUserName",key:"outUserName"},
            {title:"总数量",dataIndex:"itemsNumber",key:"itemsNumber"},
        ]
        columns.push({
            title:"状态",dataIndex:"status",key:"status",width:"8%",className:"row-status",render:(text,record,index)=>{
                let result = "";
                switch (text){
                    case '0':result = <span><Badge status="default" />未提交<Tooltip title="点击即可提交"><Button style={{marginLeft:10}} type="primary" size="small" icon="upload" shape="circle" onClick={(e)=>{this.upload(record)}}></Button></Tooltip></span>;break;
                    case '1':result = <span><Badge status="processing" />已提交</span>;break;
                    case '2':result = <span><Badge status="processing" />分配库位中</span>;break;
                    case '3':result = <span><Badge status="processing" />分配完成</span>;break;
                    case '4':result = <span><Badge status="processing" />待出库</span>;break;
                    case '5':result = <span><Badge status="success" />已完成</span>;break;
                    default:break;
                }
                return result;
            }
        })
        columns.push({
            title:"操作",key:"operation",width:"8%",render:(text,record,index)=>{
                
                let result = (   
                    <span>
                        <Button size="small" type="primary" className="table-edit-btn" onClick={()=>{this.showModal("edit",record)}}>编辑</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record)}>
                            <Button size="small" type="danger" className="table-del-btn">删除</Button>
                        </Popconfirm>
                    </span>
                )
                switch (record.status){
                    case "0":break;
                    default:
                        result = "";
                        break;
                }
                return result;    
                
            }
        })
        this.columns = columns;

    }
    handleSearch = (data) =>{
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
    //表格分页变化时的处理函数
    handleTableChange = (pagination, filters, sorter) => {
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
        sort.field = sorter.field;
        sort.order = sorter.order;
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
                    return item=="ascend"?"A":"D";
                })
            }else{
                params.sortOrder = params.sortOrder == "ascend"?"A":"D";
            }

        }
        axios({
            url:"/withdraws",
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
                    this.setState({loading:false,dataSource:[],pagination})
                }
                return
            };
            const pagination = {...this.state.pagination};
            pagination.total = parseInt(res.data.total)||0;
            let dataSource = [];
            if(res.data.data instanceof Array){
                dataSource = res.data.data;
                dataSource.map(item =>{

                    Object.keys(item).forEach(key => {

                            if(key == "location"){
                                if(item.location){
                                    item["name"]=item["location"]["name"];
                                    item["address"]=item["location"]["address"];
                                    item["principalName"]=item["location"]["principalName"];
                                    item["principalPhone"]=item["location"]["principalPhone"];
                                    item["postcode"]=item["location"]["postcode"];
                                }else{
                                    item["name"]=""
                                    item["address"]=""
                                    item["principalName"]=""
                                    item["principalPhone"]=""
                                    item["postcode"]=""
                                }

                            } else {
                                item[key]=item[key]||""
                            }

                    })
                })
            }

            this.setState({
                pagination,
                loading:false,
                dataSource
            })
        }).catch(e =>{
             message.error("系统出错,请重新尝试");
             this.setState({loading:false})
        })
    }
    componentDidMount() {
        this.axios({ pageindex:1});
    }
    handleChangeTotal = (total)=>{
        this.setState({total:total})
    }
    upload = (record) =>{
        axios.get("/withdraw/code/"+record.outCode+"/items")
            .then(res =>{
                if(res.data.data instanceof Array && res.data.data.length>0){
                    axios({
                        url:"/withdraw/code/"+record.outCode+"/status/"+"1",
                        method:"put"
                    }).then(res => {
                        const code = res.data.code;
                        if(code =="200"||code=="201"||code=="203"||code=="204") {
                            message.success("分配货品成功")
                            record.status = "4";
                            this.setState({
                                dataSource:this.state.dataSource
                            })
                            return;
                        }else{
                            message.warning(res.data.msg||"分配货品失败");
                        }
                    }).catch(e =>{
                        message.error("系统错误,请重新尝试")
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
            url:"/withdraw/code/"+record.outCode,
            method:"delete",
        }).then(res=>{
            if(!checkCode(res.data.code)){return};
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
        const {modalData} = this.state ;
        Object.keys(modalData).forEach(key=>{
            if(type == "add"){
                modalData[key].value = "";
            }else if (type == "edit"){
                modalData[key].value = record[key];
            }
        })
        
        let editIndex = -1;
        this.state.dataSource.forEach((item,index)=>{
            if(item === record){editIndex = index}
        })

        let modalTitle = "";
        if(type == "add") modalTitle ="新增出库申请单";
        if(type == "edit") modalTitle ="修改出库申请单";
        let modalKey = "";
        if(type == "edit"){
            modalKey = (record.id||"")+new Date(0).toUTCString();
        }
        if(type == "add"){
            modalKey = 1000*Math.random()+ new Date(0).toUTCString();
        }




        this.setState({
            modalType:type,
            editIndex:editIndex,
            visible:true,
            modalData,
            modalTitle,
            modalKey
        })
       
       
    }
    handleOk = (data) => {
        this.setState({
            visible: false,
        });
        if(this.state.modalType === "add"){
            axios({
                url:"/withdraw",
                data:{
                    ...data,
                    warehouseName:null
                },
                method:"post"
            }).then((res)=>{
                if(!checkCode(res.data.code))return;
                const {searchData,pagination,sorter}= this.state;
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
        }else{

            axios({
                url:"/withdraw/"+this.state.dataSource[this.state.editIndex].id,
                method:"put",
                data:{
                    ...data,
                    warehouseName:null
                }
            }).then(res=>{
                if(!checkCode(res.data.code))return;
                const {searchData,pagination,sorter}= this.state;
                this.axios({
                    pageindex:pagination.current||1,
                    pagesize:pagination.pagesize||10,
                    ...searchData,
                    sortField:sorter.field,
                    sortOrder:sorter.order

                })
            }).catch(e=>{
                message.error("系统出错,请重新尝试");
            })

        }

    }
    handleCancel = (e) => {
        
        this.setState({
            visible: false,
        });
    }

    render = ()=> {
        const expandedRowRender = (record) =>{

            return <Table2 status={record.status} code={record.outCode} handleChangeTotal={this.handleChangeTotal}/>
        }

        const propParams = {
            name: 'file',
            action: '/api/withdraw/upload',
            accept: '.xls,.xlsx',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let rstCode = info.response.code;
                    if(rstCode == "200"){
                        message.success(`${info.file.name} file uploaded successfully`);
                        //重新加载页面
                        this.axios({pageindex:1});
                    }else{
                        message.error(info.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            }
        }

        return (
            <div>
                <SearchForm onSearch = {this.handleSearch}/>
                <Button className='table-add-btn' onClick={()=>{this.showModal("add")}} type="primary">增加</Button>
                <Upload style={{ marginLeft: 8 }} {...propParams}>
                    <Button>
                        <Icon type="upload" /> 发货通知单导入
                    </Button>
                </Upload>
                <Table  className="components-table-nested" columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} loading={this.state.loading} rowKey={record => record.id} dataSource ={this.state.dataSource} expandedRowRender={expandedRowRender} />
                <ModalForm key={this.state.modalKey} modalType={this.state.modalType} title={this.state.modalTitle} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}  modalData={this.state.modalData}/>
            </div>
           
        )
        
    }



}
export default BasicTable;