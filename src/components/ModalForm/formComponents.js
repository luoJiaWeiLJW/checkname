import React,{Component} from 'react';
import {Input,DatePicker,InputNumber} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function Input_ (text,value,disabled) {
    return <Input data-text = {value} data-value = {text} autoComplete="off" disabled={disabled}/>
}


function DatePicker_ (text,value,format){
    let dataValue = moment(text,format);
    if(!dataValue._isValid){dataValue=moment()}
    let dataText = value.format?value.format(format):""; 
    return <DatePicker data-text={dataText} data-value = {dataValue} format={format}/>
    
}

function Number_(text,value,precision) {
    return  <InputNumber data-text ={value} data-value ={text} style={{width:220}} min={0} step={1} precision={precision}/>
}
export {Number_,Input_,DatePicker_} 