import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as QRCode from 'easyqrcodejs';

import './view.scss';
import squaredImage from './square_white_bckgrnd.png';

const Preview = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);
  const token = useSelector(state => state.token);

  const qrcode = useRef(null);

  useEffect(() => {
    // qrcode Options
    var options = {
      text: `http://emojinotes.herokuapp.com/n/${token}`,
      logo: `${squaredImage}`,
      logoWidth:80, // widht. default is automatic width
      logoHeight:80, // height. default is automatic height
      logoBackgroundColor:'#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
    }
    // Create new QRCode Object
    new QRCode( qrcode.current, options);
  });

  const emoji = (emoName) => {
    let result = '';
    switch (emoName) {
      case 'christmas tree':
        result = '🎄';
        break;
      case 'love letter':
        result = '💌';
        break;
      case 'heart eyes':
        result = '😍';
        break;
      case 'tears of joy':
        result = '😂';
        break;
      default:
        result = '🕴️';
    }
    return result;
  }


  const copyToClipboard = str => {
    const el = document.createElement('textarea');            // Create a <textarea> element
    el.value = `http://emojinotes.herokuapp.com/n/${token}`;  // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                          // Make it readonly to be tamper-proof
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                                // Move outside the screen to make it invisible
    document.body.appendChild(el);                            // Append the <textarea> element to the HTML document
    const selected =            
      document.getSelection().rangeCount > 0                  // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)               // Store selection if found
        : false;                                              // Mark as false to know no selection existed before
    el.select();                                              // Select the <textarea> content
    document.execCommand('copy');                             // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                            // Remove the <textarea> element
    if (selected) {                                           // If a selection existed before copying
      document.getSelection().removeAllRanges();              // Unselect everything on the HTML document
      document.getSelection().addRange(selected);             // Restore the original selection
    }
  };

  return (
    <>
      <div className="view card">
        <span className="card-emoji" role="img" aria-label={emo}>{emoji(emo)}</span>
        <div className="card-message">
          {message}
        </div>
      </div>
      <button title="copy your emoji-note URL to clipboard" className="btn" onClick={copyToClipboard}>copy url to clipboard</button>
      <button>Show QR-Code</button>
      <div ref={qrcode}></div>
    </>
  );

}

export default Preview;
