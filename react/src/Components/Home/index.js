import React from 'react';

import {Link} from 'react-router-dom';

import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import AntTable  from 'antd/lib/table';
import {connect} from 'react-redux';
import {getList, getDetail, delUser ,getDR, fetchData, getManager, getMatchedData} from "../../redux/actions";
import Highlighter from 'react-highlight-words';

import Divider from 'antd/lib/divider';

import Popconfirm from 'antd/lib/popconfirm';
import { Avatar } from 'antd';
import { Icon } from 'antd';
import 'antd/dist/antd.css';
//import { InfinityTable } from 'antd-table-infinity';
import { InfinityTable} from 'antd-table-infinity';
import { random } from 'lodash';
import { resolve, reject } from 'q';
//import './index.css';

const ob = {DR: 1,
    cellphone: "22",
    email: "22@hotmail.com",
    gender: "M",
    image: "data:image/jpeg;base64,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",
    name: "22",
    officephone: "123456",
    parent: null,
    sms: "22",
    startdate: "2019-05-01",
    title: "22",
    __v: 0,
    _id: "5cf014f8a731a07968642641"};
class Home extends React.Component {

    state = {
        userdata: [],//[ob, ob, ob, ob, ob, ob, ob, ob,],
        managerdata:[],
        loading: false,
        input: '',
      };
    constructor(props) {
        super(props);
        //this.state = { input: "" }; 
        this.columns = [
        {
            title: '       ',
            //colSpan: 2,
            dataIndex: 'image',
            key: 'image',
            width: 30,
            render: (text, record) => (
                    <Avatar src= {record.image} />
            ),
        },
        {
            title: 'Name',
            //colSpan: 2,
            dataIndex: 'name',
            key: 'name',
            width: 20,
            sorter: (a, b) => {
                if (a.name > b.name){
                    return 1;
                }
                else if (a.name === b.name)
                {
                    return 0;
                }
                else{
                    return -1;
                }
            }, 
            ...this.getColumnSearchProps('name'),//.charCodeAt(0) 
        },
        {
            title: 'Title',
            //colSpan: 2,
            dataIndex: 'title',
            key: 'title',
            width: 60,
        },
        {
            title: 'Gender',
            //colSpan: 2,
            dataIndex: 'gender',
            key: 'gender',
            width: 60,
        },
            //render: text => <a href="javascript:;">{text}</a>,
        {
            title: 'Start Date',
            //colSpan: 2,
            dataIndex: 'startdate',
            key: 'startdate',
            width: 160,
            //sorter: (a, b) => a - b,
            //...this.getColumnSearchProps('startdate'),
        },
        {
            title: 'Office Phone',
            //colSpan: 2,
            dataIndex: 'officephone',
            key: 'officephone',
            width: 160,
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`tel:${record.officephone}`}> {`${record.officephone}`}</Button>
            ), 
            ...this.getColumnSearchProps('officephone'),
        },
        {
            title: 'Cell Phone',
            //colSpan: 2,
            dataIndex: 'cellphone',
            key: 'cellphone',
            width: 130,
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`tel:${record.cellphone}`}> {`${record.cellphone}`}</Button>
            ),
            ...this.getColumnSearchProps('cellphone'),
        },
        {
            title: 'SMS',
            //colSpan: 2,
            dataIndex: 'sms',
            key: 'sms',
            width: 130,
            ...this.getColumnSearchProps('sms'),
        },
        {
            title: 'Email',
            //colSpan: 2,
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`mailto:${record.email}`}> {`${record.email}`}</Button>
            ),
            ...this.getColumnSearchProps('email'),
        },
        {
            title: 'Manager',
            //colSpan: 2,
            dataIndex: 'parent.name',
            key: 'parent',
            width: 100,
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type = "link" onClick = {() => this.handleClickManager(record)}> {(record.parent!==undefined && record.parent !== null && record.parent.name !== undefined && record.parent.name!==null)? `${record.parent.name}`:''}</Button>
            ),
            ...this.getColumnSearchProps('parent.name'),
        },
        {
            title: '# of DR',
            //colSpan: 2,
            dataIndex: 'DR',////////////////////
            key: 'DR',
            width: 100,
            render:(text, record)=>(
                <Button type = "link" onClick = {() => this.handleClickDR(record)}> {(record.DR!==undefined && record.DR !== null)? `${record.DR}`:''}</Button>
            ),
        },
        {
            title: 'Action',
            //colSpan: 2,
            key: 'action',
            width: 250,
            render: (text, record) => (
            <span>
                <Link style = {{margin: 10}} to="/edit">
                    <Button  type = "link" onClick = {()=> this.handleEdit(record._id)}> Edit </Button>
                </Link>
                <Divider type="vertical" />
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
                    {/*<a href="javascript:;"> </a>*/}
                    <Icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                </Popconfirm>
            </span>
            ),
        },
        ];
    };//constructor

    
    
    getGuid = () =>
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                /* eslint-disable */
                let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
        });
        loadMoreContent = () => (
            <div
            style={{
                //textAlign: 'center',
                paddingTop: 40,
                //paddingBottom: 40,
                //border: '1px solid #e8e8e8',
            }}
            >
            <Spin tip="Loading..." />
            </div>
    );

    getColumnSearchProps = dataIndex => ({
        //////////////////////////////////////////
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.input]}
                autoEscape
                textToHighlight={((text !== null) && (text !== undefined)) ? text.toString():''}
            />
        ),
    });
    handleInput = e => {
        if (e.target.value !== undefined)
        {
            this.setState({ input: e.target.value });
            this.props.getSearchResult(this.state.input);
        }
        else{
            this.setState({ input: ''});
            this.props.getSearchResult(this.state.input);
            
        }
        //console.log('input', this.state.input)
    };
    
    handleSearch = () => {
        //console.log(this.props.input)
        this.props.getSearchResult(this.state.input);
        //this.setState({ input: '' });
    }

    handleDelete = user_id => {
        //console.log('user_id', user_id);
        this.props.deleteUser(user_id);
    };
    
    handleEdit = user_id => {
        console.log('user_id', user_id);
        this.props.editUser(user_id);
        this.props.getManager(user_id);
    };
    
    handleClickManager = record => {
        //console.log('user_id', user_id);
        //this.props.editUser(user_id);
        console.log('Manager info:' , record.parent)
        this.setState({
            managerdata : [record.parent]
        })
        console.log('managerdata renewed', this.state.managerdata);
    };
    handleReset = () =>{
        this.setState({
            managerdata: [],
        })
        //this.handleClickDR('000');
        this.props.DR.data = [];
        this.props.getUserList();
    }

    handleClickDR = (record) => {
        return new Promise((resolve, reject) =>{
            this.props.getDR(record._id);
            //this.props.getDR(record._id);
            resolve(this.props.DR.data);
        })
        .then( (value)=> {  
                this.setState({
                    userdata: value//this.props.DR.data
                }),
                console.log('DR info', this.props.DR.data)
                }
            )//then
        .catch((err) => {
            console.log('Some err happend when getting DR info', err)
        })
    }
    
    handleFetch = () => {
        console.log('loading');
        this.setState({ loading: true });
        console.log('hit the bottom and refresh data')
        return new Promise((resolve, reject) =>{
            const len = [...this.props.userList.data].length
            this.props.getUserList()
        })
    }
            
            /*while(this.props.userList.data.length === len){
                setTimeout(()=>{
                    console.log('waiting for userList info update')
                }, random(0, 1.0) * 10000);
            //}*/
        /*    resolve();
        })
        .then( ()=> {  
            console.log('new value', this.props.userList.data);////////////////////////////
            this.setState({
                userdata: this.props.userList.data//this.props.DR.data
            }),
            console.log('fetched List info', this.props.userList.data)
            }
            )//then
        .catch((err) => {
            console.log('Some err happend when getting userList info', err)
        })
    }*/
    componentDidUpdate(prevProps) {
        if (prevProps.userList.data !== this.props.userList.data) {
            this.setState({
                loading: false,
                userdata: this.props.userList.data//this.props.DR.data
            });
        }
      }
    
    render(){
        var { input, userdata, managerdata, loading} = this.state;
        //userdata = this.props.userList.data;
        //var userList = [];
        //console.log('this.state.data', this.state.data);
        //const { userList, matchedData } = this.props;
        /*if (this.props.matchedData.data === undefined || this.props.matchedData.data.length === 0 )
        {
            userList = this.props.userList;
        }
        else
        {
            userList = this.props.matchedData;
        }*/
            return (
            <div>
            <h2>Home</h2>
                <input style = {{margin: 10}} value={input} onChange={this.handleInput} />
                    
                <Button style = {{margin: 10}} type="primary" onClick = {this.handleSearch} >Search</Button>
                
                <Link style = {{margin: 10}} to="/create">Create new user</Link>
                
                <Button style={{float: 'right' , margin: 10, backgroundColor: 'green'}} type="primary" onClick = {this.handleReset} >Reset</Button>
 
                <InfinityTable
                    key="_id"//"key"
                    loading={this.state.loading}////
                    onFetch={this.handleFetch}//this.props.getUserList}//fetch more new data from db
                    pageSize={7}
                    loadingIndicator={this.loadMoreContent()}
                    columns={this.columns}
                    scroll={{ y: 450 }}
                    //{this.props.getUserList}
                    dataSource={(managerdata===undefined || managerdata.length == 0)?
                    (this.props.DR.data === undefined || this.props.DR.data.length == 0?userdata: this.props.DR.data)
                    : managerdata}//// */
                    //{...console.log('*********',this.state.userdata)}
                    bordered
                    debug
                />
     
            </div>
        );
    }
 
}

const mapStateToProps = state => {
    return {
      userList: state.list,
      deleteUser: state.deleteUser,
      matchedData: state.search,
      DR: state.DR
    };
  };
const mapDispatchToProps = dispatch => {
    return {
        getUserList: () => {
            console.log('dispatching get more user');
            dispatch(getList());
        },
        editUser: (id) => {
            dispatch(getDetail(id));
        },
        deleteUser: (id) => {
            dispatch(delUser(id));
        },
        getDR:(id) => {
            dispatch(getDR(id));
            //callback()
        },
        getManager:(id) => {
            dispatch(getManager(id))
        },
        getSearchResult:(input) => {
            dispatch(getMatchedData(input))
        }
    };
};
//store.subscribe(Home.render);///////////////////////////////////
//const HomeWithRouter = withRouter(Home);
export default connect(mapStateToProps, mapDispatchToProps)(Home);