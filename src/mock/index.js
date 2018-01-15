import Mock from 'mockjs'
const Random = Mock.Random;
Mock.setup({
    timeout:500
})
Mock
.mock(
    /\/api\/stores\/search\/keywords/,'get',{
        'code':"200",
        'total':300,
        'data|10':[
           {'company':"清本科技",'intoDate':"2017-4-5",'id|+1':3,"warehouseName":"3号仓库","carNumber":"HS239182","provideGroupName":"生产部","provideUserName":"小李","consigneeUserName":"小赵"}
        ]
})
.mock(
    /\/withdraws/,'get',{
        'code':'200',
        'data':{
            'total':'200',
            'results|10':[
                {'id|+1':1000,'status|1':['1','2','3'],"out_date":"2017-4-23","out_code":'sdsdjkg12','name':'清本科技','address':"浙江温州",'principal_name':'小李',"principal_phone":"12349876221",'postcode':'0372813',"predict_deliver_time":"2017-3-12","logistics_type":"京东自提","logistics_company":"京东","out_group_name":"生产部","out_user_name":"小王"}
            ]
                
        }
    }
)
.mock(
    /\/withdraw/,'post',{
        'code':'200',
        'data':{

        }
    }
)
