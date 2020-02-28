import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import './view.scss';

const GetEmojinotes = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);
  //
  const [isFetching, setIsFetching] = useState(true);
  const [setMessage] = useState('');
  const dispatch = useDispatch();

  const getTokenInUrl = () => {
    // get the token in the window.location url
    let token = window.location.pathname;
    // return the token without /n/
    return token.replace('/n/', '');
  }

  const [url, setUrl] = useState('/emojinote/' + getTokenInUrl());

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        dispatch({ type: 'LOAD_EMOJINOTE', message: json.note, emo: json.emoji });
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);
  //

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

  const LoadingNote = () => {
    return (
      <div
        className="loading"
      >
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  const EmojinoteView = () => {
    return (
      <>
        <div className="view card">
          <span className="card-emoji" role="img" aria-label={emo}>{emoji(emo)}</span>
          <div className="card-message">
            {message}
          </div>
        </div>
        <Link className='btn' to='/'>Create your own Emojinotes</Link>
      </>
    )
  }

  return (
    isFetching ? <LoadingNote /> : <EmojinoteView />
  );

}

export default GetEmojinotes;
