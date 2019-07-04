import React from 'react';

import {Link, withRouter} from 'react-router-dom';

import Button from 'antd/lib/button';
import Table  from 'antd/lib/table';
import {connect} from 'react-redux';
import {getList, getDetail, delUser} from "../../redux/actions";
import Highlighter from 'react-highlight-words';

import Divider from 'antd/lib/divider';

import Popconfirm from 'antd/lib/popconfirm';
import { Avatar } from 'antd';
import { Icon } from 'antd';
import 'antd/dist/antd.css';
//import './index.css';


class Home extends React.Component {

    constructor(props) {
        super(props);
        
        this.columns = [
        {
            title: ' ',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => (
                <span>
                    <Avatar src= {record.image} />
                </span>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            //...this.getColumnSearchProps('name'),//.charCodeAt(0) 
            
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
            //render: text => <a href="javascript:;">{text}</a>,
        
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            key: 'startdate',
            //sorter: (a, b) => a - b,
        },
        
        {
            title: 'Office Phone',
            dataIndex: 'officephone',
            key: 'officephone',
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`tel:${record.officephone}`}> {`${record.officephone}`}</Button>
            
            ),
            
        },
        {
            title: 'Cell Phone',
            dataIndex: 'cellphone',
            key: 'cellphone',
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`tel:${record.cellphone}`}> {`${record.cellphone}`}</Button>
            
            ),
            
        },
        {
            title: 'SMS',
            dataIndex: 'sms',
            key: 'sms',
            
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render:(text, record) =>(
                /*<a href = {`mailto:${record.email}`}> {String(`${record.email}`)}</a> */
                <Button type="link" href = {`mailto:${record.email}`}> {`${record.email}`}</Button>
            
            ),
            
        },
        {
            title: 'Manager',
            dataIndex: 'parent.name',
            key: 'parent',
            
        },
        {
            title: '# of DR',
            dataIndex: 'DR',////////////////////
            key: 'DR',
            
        },
        {
            title: 'Action',
            key: 'action',
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
        this.state = { input: "" }; 
    };

    /*getColumnSearchProps = dataIndex => ({
        //////////////////////////////////////////
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.input]}
            autoEscape
            //textToHighlight={text.toString()}
          />
        ),
      });*/

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
        //console.log('user_id', user_id);
        this.props.editUser(user_id);
    };
    
    render(){
        const { input } = this.state;
        var userList = [];
        //const { userList, matchedData } = this.props;
        //console.log('matchedData',this.props.matchedData)
        //console.log('ListData',this.props.userList)
        if (this.props.matchedData.data === undefined || this.props.matchedData.data.length === 0 )
        {
            userList = this.props.userList;
        }
        else
        {
            userList = this.props.matchedData;
        }
            return (
            <div>
            <h2>Home</h2>
                <input style = {{margin: 10}} value={input} onChange={this.handleInput} />
                    
                <Button style = {{margin: 10}} type="primary" onClick = {this.handleSearch} >Search</Button>

                <Link style = {{margin: 10}} to="/create">Create new user</Link>
                
                <Table columns={this.columns} dataSource = {userList.data} rowKey={record=>record._id} ></Table>
                
                
            </div>
        );
    }
 
}


const mapStateToProps = state => {
    return {
      userList: state.list,
      deleteUser: state.deleteUser,
      matchedData: state.search,
    };
  };
const mapDispatchToProps = dispatch => {
    return {
        getUserList: () => {
            dispatch(getList());
        },
        editUser: (id) =>{
            dispatch(getDetail(id));
        },
        deleteUser: (id) => {
            dispatch(delUser(id));
        },
    };
};
//store.subscribe(Home.render);///////////////////////////////////
//const HomeWithRouter = withRouter(Home);
export default connect(mapStateToProps, mapDispatchToProps)(Home);