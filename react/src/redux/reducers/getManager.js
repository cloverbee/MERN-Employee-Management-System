const initialState = {
    data: [],
    user_id: null,
    err: null,
    isLoading: false
  };
  
  const getManager = (state = initialState, action) => {
    switch(action.type) {
      case "GET_MANAGER_REQUEST":
        return {
          ...state,
          isLoading: true,
          user_id: action.user_id,

        };
      case "GET_MANAGER_SUCCESS":
        return {
          isLoading: false,
          data: action.data,
          user_id: action.user_id,
          err: null
        };
      case "GET_MANAGER_FAIL":
        return {
          ...state,
          isLoading: false,
          err: action.err,
        };
      default:
        return state; 
    }
  };
  
  export default getManager;