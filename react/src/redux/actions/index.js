import axios from "axios";
import { resolve } from "path";

const getMatchedRequest = () => {
  return {
    type: "GET_MATCHED_DATA_REQUEST"
  };
};
const getMatchedSuccess = (matchdata) => {
  return {
    type: "GET_MATCHED_DATA_SUCCESS",
    data: matchdata
  };
};
const getMatchedFail = (matcherr) => {
  return {
    type: "GET_MATCHED_DATA_FAIL",
    error: matcherr
  }
};

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

const getDRRequest = (user_id) => {
  return {
    type: "GET_DR_REQUEST",
    user_id: user_id,
  };
};
const getDRSuccess = (DRdata, user_id) => {
  return {
    type: "GET_DR_SUCCESS",
    data: DRdata,
    user_id: user_id
  };
};
const getDRFail = (DRerr) => {
  return {
    type: "GET_DR_FAIL",
    err: DRerr
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

var PageNum = Number(0);
var data = [];
var limit = 8;
//var cnt = 0;
export const getList = () => {//every time get new data
    return async (dispatch) => {
      console.log('PageNum', PageNum);
      
      dispatch(getListRequest());
      axios.get("http://localhost:8080/api/list", {params:{PageNum, limit}})  //////////
          .then(res => {    
            console.log(data.length)///////////////////////////////////
            PageNum = PageNum + 1;
            console.log('PageNum', PageNum);

            data = data.concat(res.data);
            console.log('we have items length', data.length)

            dispatch(getListSuccess(data));
        })
        .catch(err=>{
          console.log('fetching err',err)
          dispatch(getListFail(err));
        })
  }
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

export const getDR = (user_id) => {
  return (dispatch) => {
    dispatch(getDRRequest());
    axios.get(`http://localhost:8080/api/users/DR/:${user_id}`, {params: {user_id}})
      .then(res => {
        dispatch(getDRSuccess(res.data, user_id));
        //dispatch(getListSuccess(res.data));
      })
      .catch(err => {
        dispatch(getDRFail(err));
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

//====================================================
export const getMatchedData = (matchedText) => {
  return (dispatch) => {
    dispatch(getMatchedRequest());
    axios.post(`http://localhost:8080/api/search`, {
      "seachText": matchedText
    })
      .then(res => {
        dispatch(getMatchedSuccess(res.data.matchedText));
      })
      .catch(err => {
        dispatch(getMatchedFail(err));
      });
  }
};

export const getManager = (user_id) => {
  return (dispatch) => {
    console.log('action got userid',user_id)
    dispatch(getManagerRequest());
    axios.get(`http://localhost:8080/api/manager/:${user_id}`, {params: {user_id}})//first get list
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
        console.log('get Manager fail',err)
        dispatch(getManagerFail(err));
      });
  };
}

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

const getDatePickerDate = (newdate) =>{
  return {
    type: "GET_DATEPICKER_DATE",
    data:  newdate
  };
}

export const changeDatePickerDate = (newdate) => {
  return (dispatch) => {
    dispatch(getDatePickerDate(newdate));
  }
}