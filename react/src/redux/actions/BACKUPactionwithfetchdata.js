import axios from "axios";

const saveUserRequest = (user) => {
  return {
    type: "SAVE_USER_REQUEST",
    data: user
  };
};
const saveUserSuccess = (res) => {
  return {
    type: "SAVE_USER_SUCCESS",
    res: res
  };
};
const saveUserFail = (err) => {
  return {
    type: "SAVE_USER_FAIL",
    err: err
  };
};

const getListRequest = () => {
  return {
    type: "GET_LIST_REQUEST"
  };
};
const getListSuccess = (listdata) => {
  return {
    type: "GET_LIST_SUCCESS",
    data: listdata
  };
};
const getListFail = (listerr) => {
  return {
    type: "GET_LIST_FAIL",
    err: listerr
  };
};

const getDetailRequest = (user_id) => {
  return {
    type: "GET_DETAIL_REQUEST",
    user_id: user_id,
  };
};
const getDetailSuccess = (detaildata, user_id) => {
  return {
    type: "GET_DETAIL_SUCCESS",
    data: detaildata,
    user_id: user_id
  };
};
const getDetailFail = (detailerr) => {
  return {
    type: "GET_DETAIL_FAIL",
    err: detailerr
  };
};

const getManagerRequest = () => {
  return {
    type: "GET_MANAGER_REQUEST",
    //user_id: user_id,
  };
};
const getManagerSuccess = (managerdata) => {
  //console.log('getManagerSuccess managerdata', managerdata); got it
  return {
    type: "GET_MANAGER_SUCCESS",
    data: managerdata,
    //user_id: user_id
  };
};
const getManagerFail = (managererr) => {
  return {
    type: "GET_MANAGER_FAIL",
    err: managererr
  };
};

const deleteUserRequest = (user_id) => {
  return {
    type: "DEL_USER_REQUEST",
    user_id: user_id
  };
};
const deleteUserSuccess = (res) => {
  return {
    type: "DEL_USER_SUCCESS",
    //data: listdata
    res: res
  };
};
const deleteUserFail = (err) => {
  return {
    type: "DEL_USER_FAIL",
    err: err
  };
}; 

//===========================================================================
export const saveToUserList = (user, history) => {
  return (dispatch) => {
    //console.log('save_action got New user',user);
    dispatch(saveUserRequest(user));///what will happen if set user to null
    axios
      .post('http://localhost:8080/api/users', user)
      .then(res => {
        //console.log('new user created!', res);
        dispatch(saveUserSuccess(res));
        dispatch(getList());////////////////////////////////////////////
        history.push('/');
      })
      .catch(err => {
        //console.log(err);
        dispatch(saveUserFail(err));
      });
  };
};
//=========================================================================
const fetchData = (PageNum) => {
    console.log('fetching....');
    new Promise( resolve => {

        resolve(
          axios.get("http://localhost:8080/api/list", {query:{page: PageNum, limit: 6}})  //////////
          .then(res => {    
            console.log(res.data)///////////////////////////////////
            //resolve(
            res.data.map( obj => { 
              var rObj = {};
              rObj._id = obj._id;
              rObj.name = obj.name;
              //console.log(rObj)
              return rObj;
            })//res an Array
          //)////////
        })
        .catch(err=>{
          console.log('fetching err',err)
        })
      );//resolve
      
    
})};

var PageNum = 0;
var data = [];
export const getList = () => {//every time get new data
  return (dispatch) => {
    console.log('PageNum', PageNum);
      dispatch(getListRequest());
      fetchData(PageNum, (err, res) =>{
        console.log('back from fetchData')
        if(err){
          console.log('fetchData', err);
          dispatch(getListFail(err));
        }
        else{
          console.log(res)
          PageNum ++;
          dispatch(getListSuccess(data.concat(res)));
          data = data.concat(res);
        }
      })


      /*.catch(err => {
        console.log('fetchData');
        dispatch(getListFail(err));
      })
      .then(data => {
          PageNum ++;
          dispatch(getListSuccess(data.concat(data)));
      })*/
      
    //data = data.concat(data);
  }//return 

      /*axios.get("http://localhost:8080/api/list")
        .then(res => {
          dispatch(getListSuccess(res.data));
        })
        .catch(err => {
          dispatch(getListFail(err));
        });*/
};

export const getDetail = (user_id) => {
  return (dispatch) => {
    dispatch(getDetailRequest());
    axios.get(`http://localhost:8080/api/users/:${user_id}`, {params: {user_id}})
      .then(res => {
        dispatch(getDetailSuccess(res.data, user_id));
      })
      .catch(err => {
        dispatch(getDetailFail(err));
      });
  };
};

export const saveEditedToUserList = (user, user_id, history) => {
  return (dispatch) => {
    //console.log('save_action got New user',user);
    dispatch(saveUserRequest(user));///what will happen if set user to null
    axios
      .put(`http://localhost:8080/api/users/:${user._id}`, {user, params: {user_id}})//, {params: {user_id}})
      .then(res => {
        //console.log('Edit user finished!', res);
        dispatch(saveUserSuccess(res));
        history.push('/');
      })
      .catch(err => {
        //console.log(err);
        dispatch(saveUserFail(err));
      });
  };
};

export const getManager = () => {
  return (dispatch) => {
    dispatch(getManagerRequest());
    axios.get("http://localhost:8080/api/list")//first get list
      .then(res => {
        var managerdata = res.data.map(obj => { 
          var rObj = {};
          rObj._id = obj._id;
          rObj.name = obj.name;
          return rObj;
       })
       //console.log('managerdata',managerdata);
        dispatch(getManagerSuccess(managerdata));//,// user_id));
      })
      .catch(err => {
        dispatch(getManagerFail(err));
      });
  };
};

export const delUser = (user_id) => {
  return (dispatch) => {
    console.log('action got userid',user_id)
    dispatch(deleteUserRequest());
    axios.delete(`http://localhost:8080/api/users/:${user_id}`, {params: {user_id}})
      .then(res => {
        console.log('del res', res);
        dispatch(deleteUserSuccess(res));
        dispatch(getList());
      })
      .catch(err => {
        console.log('del err', err);
        dispatch(deleteUserFail(err));
      });
  };
};