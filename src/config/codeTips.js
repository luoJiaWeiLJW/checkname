import {message} from "antd"

export default function(code){
    if(code == "200"){
        return true;
    }
    if(code == "201"|| code == "203" || code == "204"){
        message.success("操作成功")
        return true;
    }
    if(code == "402"){
        message.warning("您没有权限")
        return false;
    }
    if(code =="500"){
        message.warning("系统繁忙");
        return false;
    }
    if(code == "501"||code=="508"){
        message.warning("请求超时")
        return false;
    }
    if(code == "600"||code == "601"){
        message.warning("登录信息失效,请重新登录")
        return false;
    }
    if (code =="602"|| code == "603"){
        message.warning("用户名或密码错误")
        return false;
    }
    if(code=="502"){
        message.warning("操作失败")
        return false;
    }if(code == "507"){
        message.warning("查询结果为空")
        return false;
    }

}