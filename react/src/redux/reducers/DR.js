const initialState = {
    data: [],
    user_id: null,
    err: null,
    isLoading: false
  };
  
  const DR = (state = initialState, action) => {
    switch(action.type) {
      case "GET_DR_REQUEST":
        return {
          ...state,
          isLoading: true,
          user_id: action.user_id,
  
        };
      case "GET_DR_SUCCESS":
        return {
          isLoading: false,
          data: action.data,
          user_id: action.user_id,
          err: null
        };
      case "GET_DR_FAIL":
        return {
          ...state,
          isLoading: false,
          err: action.err,
        };
      default:
        return state; 
    }
  };
  
  export default DR;