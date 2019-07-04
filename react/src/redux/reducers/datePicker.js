const initialState = {
    data: {},
    err: null,
    isLoading: false
  };
  
  const datePicker = (state = initialState, action) => {
    switch(action.type) {
      case "GET_DATEPICKER_DATE":
        return {
          ...state,
          isLoading: false,
          data: action.data,
        };
      default:
        return state; 
    }
  };
  
  export default datePicker;