import React from 'react';
import './Result.scss';
import { Redirect } from 'react-router-dom';

function Result(props) {
  const { data } = props.location.state;

  if (!data) {
    return <Redirect push to={{ pathname: '/' }}/>
  }

  return (
    <div>
      <p>Hello, this is Result</p>
    </div>
  )
}

export default Result;