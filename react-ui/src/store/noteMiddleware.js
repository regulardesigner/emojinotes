import axios from 'axios';
// IMPORT ACTIONS CREATORS
import { SAVE_NEW_NOTE, SHOW_QR_CODE } from '../store/reducer';

const noteMiddleware = (store) => (next) => (action) => {
  // USING HOOKS TO DISPATCH ACTIONS
  // POUR EXEMPLE: Requetes avec Axios
  // Je dois réagir uniquement à certains types d'action
  switch (action.type) {
    case SAVE_NEW_NOTE:
      // GET THE STORE WITH store.getState()
      const data = store.getState();
      debugger
      axios({
        method: 'post',
        url: '/emojinote',
        data: {
          emoji: data.emo,
          note: data.message,
          token: data.token
        }
      })
      .then((response) => {
        debugger
        console.log(response);
        // dispatch({ type: SHOW_QR_CODE, flow: 'qr-code', token: response.data})
        // const { data } = response.
        store.dispatch({ type: SHOW_QR_CODE, flow: 'qr-code' });
      })
      .catch((error) => {
        debugger
        console.log('ERROR: ', error);
      });
      break;
    default:
       next(action);
  }
};

export default noteMiddleware;
