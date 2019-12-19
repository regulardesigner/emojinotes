import axios from 'axios';
// IMPORT ACTIONS CREATORS
import { SAVE_NEW_NOTE } from '../store/reducer';

const noteMiddleware = (store) => (next) => (action) => {
  // POUR EXEMPLE: Requetes avec Axios
  // Je dois réagir uniquement à certains types d'action
  switch (action.type) {
    case SAVE_NEW_NOTE:
      // GET THE STORE WITH store.getState()
      const data = store.getState();
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
        console.log(response);
        // const { data } = response.
        // // Il faut ensuite informer le reducer des nouvelles données reçues
        // store.dispatch(receivedQqchose(data));
      })
      .catch((error) => {
        console.log(error);
      });
      break;
    default:
       next(action);
  }
};

export default noteMiddleware;
