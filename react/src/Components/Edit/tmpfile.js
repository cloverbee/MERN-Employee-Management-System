import React from 'react';
import Form from "antd/lib/form";
import {Link} from 'react-router-dom';

import {connect} from 'react-redux';
import {getDetail, saveEditedToUserList} from '../../redux/actions';
import "antd/dist/antd.css";
//import "./index.css";
import { Input, Button, Upload, Icon, message } from "antd";
import { Row, Col } from 'antd';
import { DatePicker, Select } from 'antd';
//import moment = require('moment');
import moment from 'moment';
import { Cascader } from 'antd';
import {getManager} from '../../redux/actions';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}


//======================================================
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      imgloading: false,
      imageUrl: null,
      dateString: null,
      endOpen: false,
    }; 
  }
  componentDidMount() {
    //this.props.getDetail(this.props.userDetail.user_id);//////////////////////////////
  }      
  onManagerChange = (value, selectedOptions) => {
      console.log('typeof(value)',typeof(value) )
      console.log(value[0], selectedOptions);
      //selectedOptions[0].value
  };
  onDateChange = (e) => {
      this.props.userDetail.data.startdate = moment(e).format(dateFormat);
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ imgloading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl: imageUrl,//image store in here
          imgloading: false,
        }),
      );
    }
  };
  
  handleSubmit = e => {//map input values to newvalue to save to db
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        var newvalue = {
          //pid: '5ce79c3c1c9d440000811e6b',
          name: values.name,
          title: values.title,
          gender: values.gender,
          startdate: values['datepicker'].format('YYYY-MM-DD'),//values.startdate,
          officephone: values.officephone,
          cellphone: values.cellphone,
          sms: values.sms,
          email: values.email,
          parent: (values.parent !== undefined)?values.parent[0]:undefined,//values.parent,
          //children: values.children,
          image: this.state.imageUrl!==null?this.state.imageUrl:this.props.userDetail.data.image,
        }
        console.log('newvalue',newvalue);
        this.props.saveEditedUser(newvalue, this.props.userDetail.user_id, this.props.history);
        //window.location = '/';
        //console.log('typeofdatestring', this.state.dateString);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSelectChange = value => {
  //console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };
  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
  
  render() {
    //var tmpdate = this.props.userDetail.data.startdate;

    const uploadButton = (
      <div >
        <Icon type={this.state.imgloading ? 'imgloading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    var imageUrl = this.props.userDetail.data.image;
    
    /*if(this.state.imageUrl == undefined){
        imageUrl = this.props.userDetail.data.image;
        
    }
    else {*/
      if (this.state.imageUrl !== null )
      { imageUrl = this.state.imageUrl;   }
    //}
    //console.log("     this.props.userDetail.image,", this.props.userDetail.data.image);
    const { getFieldDecorator } = this.props.form;
    //const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 33 }
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 7 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 2,
          offset: 0
        },
        sm: {
          span: 13,
          offset: 12
        }
      }
    };

    //var tmpdate = this.props.userDetail.data.startdate;
    const config = {
      //initialValue : this.props.userDetail.data.startdate,
      valuePropName: 'options',
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
      initialValue: moment(this.state.endOpen ==='add' ? moment : this.props.userDetail.data.startdate) 
      //moment(this.props.userDetail.data.startdate, dateFormat),
    };
    
    

    return (
      <div style={{backgroundColor:'white'}}>
        <h2>Edit</h2>
        <Row >
              <Col span={1} offset={2}>
              <Upload 
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"////////////
                      beforeUpload={beforeUpload}
                      onChange={this.handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
              </Upload>
              </Col>
              <Col span={14} offset ={2}>
              <Form  {...formItemLayout} onSubmit={this.handleSubmit} style= {{marginLeft:100 }}>
              <Form.Item label={<span >Name&nbsp;</span>}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your Name!",
                      whitespace: true
                    }
                  ],
                  initialValue: this.props.userDetail.data.name,
                })(<Input />)}
              </Form.Item>

              <Form.Item label={<span >Title&nbsp;</span>}>
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your Title!",
                      whitespace: true
                    }
                  ],
                  initialValue: this.props.userDetail.data.title
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Gender">
                {getFieldDecorator('gender', {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                  initialValue: this.props.userDetail.data.gender
                })(
                  <Select
                    placeholder="Select a option and change input text above"
                    //onChange={this.handleSelectChange}
                  >
                    <Option value="M">M</Option>
                    <Option value="F">F</Option>
                  </Select>,
                )}
            </Form.Item>

              
              <Form.Item label="Start Date"  >
                {getFieldDecorator('datepicker', config)(
                  <DatePicker   format={dateFormat} onChange = {date => this.onDateChange(date)} /*open={this.state.endOpen} onOpenChange={this.handleEndOpenChange}*/
                    value = {moment(this.props.userDetail.data.startdate)}
                      //moment(this.props.userDetail.data.startdate, dateFormat)
                    defaultPickerValue = { moment(this.props.userDetail.data.startdate, dateFormat)}
                  />
                  )}{/* value={ moment(this.props.userDetail.data.startdate, dateFormat)} format={dateFormat} 
                  value={ moment(this.props.userDetail.data.startdate, dateFormat)}
                  */}
              </Form.Item>

              <Form.Item label="Office Phone" hasFeedback>
                {getFieldDecorator("officephone", {
                  rules: [
                    {
                      required: true,
                    },
                
                  ],
                  initialValue: this.props.userDetail.data.officephone
                })(<Input  />)}
              </Form.Item>
              <Form.Item label="Cell Phone" hasFeedback>
                {getFieldDecorator("cellphone", {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: this.props.userDetail.data.cellphone
                })(<Input  />)}
              </Form.Item>
              <Form.Item label={<span>SMS&nbsp;</span>}>
                {getFieldDecorator("sms", {
                  rules: [
                    {
                      whitespace: true
                    }
                  ],
                  initialValue: this.props.userDetail.data.sms
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>Email&nbsp;</span>}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      whitespace: true
                    }
                  ],
                  initialValue: this.props.userDetail.data.email
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>Manager&nbsp;</span>}>
                {getFieldDecorator("parent",)(
                  <Cascader
                      options={this.props.ManagerList.data.map(obj => { 
                                                              var rObj = {};
                                                              rObj.value = obj._id;
                                                              rObj.label = obj.name;
                                                              rObj.isLeaf = true;
                                                              return rObj;})}
                      loadData={this.loadData}
                      onChange={this.onManagerChange}
                      changeOnSelect
                  />
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                  
                  <Button type="primary" htmlType="submit">
                    submit
                  </Button>
                  
              </Form.Item>
              
            </Form>
           </Col>
      </Row>
      <Link to="/" style = {{margin: 10}}>to home</Link>
      </div>
    );
  }
}
//const FormWithRouter = withRouter(RegistrationForm);
//======================================================


const mapStateToProps = state => {
  return {
    ManagerList: state.getManager,
    saveEditser: state.saveEditUser,
    userDetail: state.userDetail
  };
};

const mapDispatchToProps = dispatch => {
  return {
      getManagerList:(user_id) =>{
        dispatch(getManager(user_id));
      },
      getDetail:(user_id) =>{
        dispatch(getDetail(user_id));
      },
      saveEditedUser: (user, user_id, history) => {
          dispatch(saveEditedToUserList(user, user_id, history));
      }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: "register" })(Edit));