import React from 'react';
import './Result.scss';
import { Redirect, Link } from 'react-router-dom';
import { Button, Table } from 'antd';
import { Player, BigPlayButton } from 'video-react';
import logo from '../../assets/imgs/patch_logo.svg';
import successImage from '../../assets/imgs/result1.svg';
import { tableColumns, BUTTON_BORDER_RADIUS } from '../../constants';
import { content } from '../../content';

const { result } = content;

function Result(props) {
  if (!props.location.state) {
    return <Redirect push to={{ pathname: '/' }}/>
  }

  const { data } = props.location.state;
  const { videoUrl, affectedRegions } = data;
  const filteredAffectedRegions = affectedRegions.filter(({ corruptedPhrase }) => corruptedPhrase.length > 0);
  const numAffectedRegions = filteredAffectedRegions.length;

  return (
    <div className="Result">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-5">
            <Link to="/">
              <img className="Result__logo" src={logo} alt="Patch"/>
            </Link>
          </div>
          <div className="col-4">
            <div className="Result__againContainer">
              <Link to="/upload">
                <Button ghost type="primary" className="Result__againButton" style={{ borderRadius: BUTTON_BORDER_RADIUS }}>{result.again}</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-5">
            <Player
              playsInline
              src={videoUrl}
            >
              <BigPlayButton position="center" />
            </Player>
            <h4 className="Result__tableTitle">{numAffectedRegions} {result.regions}</h4>
            <Table
              className="Result__table"
              columns={tableColumns}
              dataSource={filteredAffectedRegions}
              pagination={false}
            />
          </div>
          <div className="col-4">
            <div className="Result__messageContainer">
              <h3 className="Result__title">{result.success.title}</h3>
              <p className="Result__subtitle">{result.success.description}</p>
              <img className="Result__image" src={successImage} alt=""/>
              <a href={videoUrl} download>
                <Button
                  className="Result__download"
                  type="primary"
                  style={{ display: "block", margin: "0 auto", borderRadius: BUTTON_BORDER_RADIUS }}
                >
                  {result.success.download}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result;