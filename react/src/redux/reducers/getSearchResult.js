const initState = {
    data: [],
    isLoading: false,
    error: null
};

const getSearchResult = (state=initState, action) => {
  switch(action.type) {
    case "GET_MATCHED_DATA_REQUEST":
      return {
        ...state,
        isLoading: true
      }

    case "GET_MATCHED_DATA_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.data
      };

    case "GET_MATCHED_DATA_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
};


export default getSearchResult;
