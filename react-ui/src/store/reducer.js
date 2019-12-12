// Initial State
const initialState = {
    message: 'Hello',
    flow: 'home',
    emo: null,
  };
  
  // Types
  const DO_SOMETHING = 'DO_SOMETHING';
  const WRITE_MESSAGE = 'WRITE_MESSAGE';
  const START = 'START';
  const SAVE_MESSAGE = 'SAVE_MESSAGE';
  const EMO_PICKER = 'EMO_PICKER';
  const LOAD_EMOJINOTE = 'LOAD_EMOJINOTE';
  
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
      case SAVE_MESSAGE:
        return {
          ...state,
          flow: action.flow,
        }
      case START:
        return {
          ...state,
          flow: action.flow,
        }
      case EMO_PICKER:
        return {
          ...state,
          emo: action.emo,
          flow: action.flow,
        }
      case LOAD_EMOJINOTE:
        return {
          ...state,
          emo: action.emo,
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
