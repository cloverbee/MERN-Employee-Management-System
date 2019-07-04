const initialState = {
    data: {},
    err: null,
    isLoading: false,
    user_id: null
  };
  
  const deleteUser = (state = initialState, action) => {
    switch(action.type) {
      case "DEL_USER_REQUEST":
        return {
          ...state,
          isLoading: true,
          user_id: action.user_id,
        };
      case "DEL_USER_SUCCESS":
        return {
          isLoading: false,
          data: action.data,
          err: null
        };
      case "DEL_USER_FAIL":
        return {
          ...state,
          isLoading: false,
          err: action.err,
        };
      default:
        return state; 
    }
  };
  
  export default deleteUser;