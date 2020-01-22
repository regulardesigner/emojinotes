// Initial State
const initialState = {
    message: '',
    flow: 'home',
    emo: null,
    qrcode: false,
  };
  
  // ACTIONS TYPES
  const WRITE_MESSAGE = 'WRITE_MESSAGE';
  const START = 'START';
  // SAVE MESSAGE ISN'T AN APROPRIATE NAME FOR THIS ACTIONS TYPE
  const SAVE_MESSAGE = 'SAVE_MESSAGE';
  const EMO_PICKER = 'EMO_PICKER';
  const LOAD_EMOJINOTE = 'LOAD_EMOJINOTE';

  // TOGGLE QR-CODE
  const TOGGLE_QR = 'TOGGLE_QR';
  
  // EXPORTED ACTIONS TYPES FOR ANOTHER MIDDLEWARE
  export const SAVE_NEW_NOTE = 'SAVE_NEW_NOTE';
  export const SHOW_QR_CODE = 'SHOW_QR_CODE';
  
  // Reducer
  const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
      case WRITE_MESSAGE:
        return {
          ...state,
          message: action.message,
        }
      case SAVE_MESSAGE:
        return {
          ...state,
          flow: action.flow,
          token: action.token,
        }
      case START:
        return {
          ...state,
          message: '',
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
      case SHOW_QR_CODE:
        return {
          ...state,
          flow: action.flow,
        }
      case TOGGLE_QR:
        return {
          ...state,
          qrcode: action.qrcode,
        }
      default:
        return state;
    }
  };
  
  // Export
  export default reducer;
