import React,{Component} from 'react';
import {Number_, Input_, DatePicker_} from './formComponents';
import {Select} from "antd";
const Option  = Select.Option;
export default  (key,text,value,title="",mark) => {
    text = text||"";
    value = value||"";
    
    let config = {rules:[{required:true,message:"请输入"+title,whitespace:true},{max:32,message:"请不要超过最大长度32位"}]};
    let input = Input_(text,value);
    
    switch (key) {
        
        case 'date': 
        input = DatePicker_(text,value,"YYYY-MM-DD");
        break;
        case 'type':
        if(mark){
            input = Input_(text,value);
        }
        else{
            input = (
                <Select data-text = {value} data-value = {text}>
                    <Option value = "1">成品仓</Option>
                    <Option value = "2">饰品仓</Option>
                    <Option value = "3">木材仓</Option>
                    <Option value = "4">五金仓</Option>
                </Select>
            )
        }

        break;
        
        case 'proDate': 
        input = DatePicker_(text,value,"YYYY-MM-DD" );
        break;

        case 'expirationDate':
        config = {rules:[{required:true,message:"请输入"+title}]};
        input = Number_(text,value,0)
        break;
        case 'price' :
        config = {rules:[{required:true,message:"请输入"+title}]};
        input = Number_(text,value,2);
        break;
        case 'extent':
        config = {rules:[{required:true,message:"请输入"+title}]};
        input = Number_(text,value,2)
        break;

        case 'height':
        config = {rules:[{required:true,message:"请输入"+title}]};
        input = Number_(text,value,2)
        break;

        case 'width':
        config = {rules:[{required:true,message:"请输入"+title}]};
        input = Number_(text,value,2)
        break;

        default:break;

    }

    return {config,input};


}