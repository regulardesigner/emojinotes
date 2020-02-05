import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as QRCode from 'easyqrcodejs';

import './view.scss';

const Preview = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);
  const token = useSelector(state => state.token);
  const qrStatus = useSelector(state => state.qrcode);

  const [toasterClass, setToasterClass] = useState('toast');
  const [isToastShowed, setIsToastShowed] = useState(false);

  const dispatch = useDispatch();

  const qr = useRef(null);

  useEffect(() => {
    // get the canvas
    const ctx = document.getElementById('canvas').getContext('2d');
    // text params
    ctx.font = "42px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji(emo), 40, 40);
    // get the encoded images from the canvas
    const emojImage = ctx.canvas.toDataURL('image/png', 1.0);
    //
    const options = {
      text: `http://emojinotes.herokuapp.com/n/${token}`,
      logo: `${emojImage}`,
      logoWidth:80, // widht. default is automatic width
      logoHeight:80, // height. default is automatic height
      logoBackgroundColor:'#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
    }
    // Create new QRCode Object
    let qrCodeGen = new QRCode(qr.current, options);
    // qrcode Options
    if(qrStatus) {
      qrCodeGen.makeCode(`http://emojinotes.herokuapp.com/n/${token}`);
    } else {
      qrCodeGen.clear();
    }
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

  // dispatch the qr code event
  const openQrCode = () => {
    qrStatus 
    ? dispatch({type: 'TOGGLE_QR', qrcode: false})
    : dispatch({type: 'TOGGLE_QR', qrcode: true});
  }

  // add show / hide class on qr-code preview
  const qrClass = () => {
    let classTag;
    qrStatus
    ? classTag = 'show'
    : classTag = 'hide'
    return classTag;
  }

  // show and hide toater
  const showToaster = () => {
    setToasterClass('toast show');
    setIsToastShowed(true);
    window.setTimeout(hideToaster, 2500);
  }

  const hideToaster = () => {
    setToasterClass('toast');
    window.clearTimeout();
  }

  isToastShowed || window.setTimeout(showToaster, 500);

  return (
    <>
      <div className={toasterClass}><span role="img" aria-label="Saved into Disk">💾</span> Your emoji-note is saved!</div>
      <h2 className='title'>Share your Emoji note!</h2>
      <div className="view card">
        <span className="card-emoji" rol="img" aria-label={emo}>{emoji(emo)}</span>
        <div className="card-message">
          {message}
        </div>
      </div>
      <div className="actions-btn">
        <button title="Copy Emoji-note URL to clipboard" className="btn spaced" onClick={copyToClipboard}><span role="img" aria-label="Clipboard">📋 </span> copy url to clipboard</button>
        <button className="btn" onClick={openQrCode}>Show QR-Code</button>
      </div>
      <div className={qrClass()}>
        <div className="qr-code" ref={qr}></div>
        <button className="btn" onClick={openQrCode}>Hide QR-Code</button>
      </div>
      <canvas id="canvas" width="80" height="80" className="playable-canvas hide"></canvas>
    </>
  );

}

export default Preview;
