// Initial State
const initialState = {
    message: 'Hello',
  };
  
  // Types
  const DO_SOMETHING = 'DO_SOMETHING';
  const WRITE_MESSAGE = 'WRITE_MESSAGE';
  
  // Reducer
  const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
      case DO_SOMETHING:
        return {
          ...state,
          message: action.message,
        };
      case WRITE_MESSAGE:
        return {
          ...state,
          message: action.message,
        }
  
      default:
        return state;
    }
  };
  
  // Action Creators
  export const doSomething = message => ({
    type: DO_SOMETHING,
    message,
  });
  
  // electors
  
  // Export
  export default reducer;
