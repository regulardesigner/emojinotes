import React from 'react';
import { useSelector } from 'react-redux';

// local import
// components:
import Message from '../Message';
import EmojiPicker from '../EmojiPicker';
import View from '../View';
import Preview from '../preview';

const New = () => {
  const flow = useSelector(state => state.flow);

  return (
    (flow === 'message' && <Message />)
    || (flow === 'emopicker' && <EmojiPicker />)
    || (flow === 'view' && <View />)
    || (flow === 'qr-code' && <Preview />)
  );

}

export default New;
