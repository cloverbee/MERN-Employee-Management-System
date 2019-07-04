
import React from 'react';
import {connect} from 'react-redux';
import 'antd/dist/antd.css';
//import './index.css';
import { Cascader } from 'antd';
import {getManager} from '../../redux/actions';


/*[
  {
    value: 'empty list',
    label: 'empty list',
    isLeaf: false,
  },
];*/

class GetManager extends React.Component {

    componentDidMount() {
        this.props.getManagerList();
    }      
    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
        //selectedOptions[0].value
    };

    render() {
        //this.props.getManagerList();
        //console.log('this.props.ManagerList',this.props.ManagerList.data)
        return (
            <Cascader
                options={this.props.ManagerList.data.map(obj => { 
                                                        var rObj = {};
                                                        rObj.value = obj._id;
                                                        rObj.label = obj.name;
                                                        rObj.isLeaf = true;
                                                        return rObj;})}
                loadData={this.loadData}
                onChange={this.onChange}
                changeOnSelect
            />
        );
    }
}
const mapStateToProps = state => {
    return {
      ManagerList: state.getManager
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {
        getManagerList:(user_id) =>{
          dispatch(getManager(user_id));
        }
    };
  };
  
  
export default connect(mapStateToProps, mapDispatchToProps)(GetManager);
          