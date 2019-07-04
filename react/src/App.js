import React from "react";
import { connect } from "react-redux";
import {BrowserRouter, Route,  Switch} from 'react-router-dom';
import { getList,  } from "./redux/actions";

import './App.css';
import Home from './Components/Home';
import Create from './Components/Create';
import Edit from './Components/Edit';
//import axios from "axios";

//import * as actions from "./redux/actions";


class App extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = { input: "" }; 
    }
    componentDidMount() {
      //this.props.getUserList();
      
    }

    render() {
      //const { userList, userDetail, getUserDetail } = this.props;
      return (
        <div>
        <BrowserRouter>
            <Switch>
              <Route exact = {true} path="/" component={Home} />
              <Route exact = {true} path="/create" component={Create} />
              <Route exact = {true} path="/edit" component={Edit} />
            </Switch>
        </BrowserRouter>
        
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    userList: state.list,
    userDetail: state.detail,
    matchedData: state.search
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserList: () => {
      dispatch(getList());
  }
    
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);