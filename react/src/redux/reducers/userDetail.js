const initialState = {
  data: {},
  user_id: null,
  err: null,
  isLoading: false
};

const userDetail = (state = initialState, action) => {
  switch(action.type) {
    case "GET_DETAIL_REQUEST":
      return {
        ...state,
        isLoading: true,
        user_id: action.user_id,

      };
    case "GET_DETAIL_SUCCESS":
      return {
        isLoading: false,
        data: action.data,
        user_id: action.user_id,
        err: null
      };
    case "GET_DETAIL_FAIL":
      return {
        ...state,
        isLoading: false,
        err: action.err,
      };
    default:
      return state; 
  }
};

export default userDetail;