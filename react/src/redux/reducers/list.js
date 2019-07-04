const initialState = {
  data: [],
  err: null,
  isLoading: false
};

const list = (state = initialState, action) => {
  switch(action.type) {
    case "GET_LIST_REQUEST":
      return {
        ...state,
        isLoading: true
      };
    case "GET_LIST_SUCCESS":
      return {
        isLoading: false,
        data: action.data,
        err: null
      };
    case "GET_LIST_FAIL":
      return {
        ...state,
        isLoading: false,
        err: action.err
      };
    default:
      return state; 
  }
};

export default list;
