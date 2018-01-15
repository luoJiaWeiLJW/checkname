import React, {Component} from 'react';
import {Table} from 'antd'
class Users extends Component {

    render () {
        const columns = [
            {'title':'工号','dataIndex':'workNumber',key:'workNumber'},
            {'title':'用户名','dataIndex':'userName',key:'userName'},
            {'title':'姓名','dataIndex':'name',key:'name'},
            {'title':'部门','dataIndex':'department',key:'department'},
            {'title':'性别','dataIndex':'gender',key:'gender'},
        ]


        return( 
        <div>
            <Table columns={columns} ></Table>
        </div>
        )
    }
}

export default Users