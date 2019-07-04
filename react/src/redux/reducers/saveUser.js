const initialState = {
    data: {},
    err: null,
    isLoading: false
  };
  
  const saveUser = (state = initialState, action) => {
    switch(action.type) {
      case "SAVE_USER_REQUEST":
        return {
            ...state,
          isLoading: true,
          data: action.user,
        };
      case "SAVE_USER_SUCCESS":
        return {
          isLoading: false,
          data: action.data,
          err: null
        };
      case "SAVE_USER_FAIL":
        return {
            ...state,
          isLoading: false,
          err: action.err
        };
      default:
        return state; 
    }
  };
  
  export default saveUser;