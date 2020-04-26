import React from 'react';
import './Result.scss';
import { Redirect, Link } from 'react-router-dom';
import { Button, Table } from 'antd';
import { Player, BigPlayButton } from 'video-react';
import { DownloadOutlined } from '@ant-design/icons';
import logo from '../../assets/imgs/patch_logo.svg';
import successImage from '../../assets/imgs/result1.svg';
import { tableColumns } from '../../constants';
import { mockData } from '../../mocks';

function Result(props) {
  console.log("props from result", props);
  const { data } = props.location.state;
  // const data = mockData;
  const { videoUrl, affectedRegions } = data;
  const filteredAffectedRegions = affectedRegions.filter(({ corruptedPhrase }) => corruptedPhrase.length > 0);
  const numAffectedRegions = filteredAffectedRegions.length;

  if (!data) {
    return <Redirect push to={{ pathname: '/' }}/>
  }

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
                <Button ghost type="primary" className="Result__againButton" style={{ borderRadius: "8px" }}>Patch again</Button>
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
            <h4 className="Result__tableTitle">{numAffectedRegions} patched regions</h4>
            <Table
              className="Result__table"
              columns={tableColumns}
              dataSource={filteredAffectedRegions}
              pagination={false}
            />
          </div>
          <div className="col-4">
            <div className="Result__messageContainer">
              <h3 className="Result__title">Patch Successful!</h3>
              <p className="Result__subtitle">We were able to patch-up your video. Check it out and download it once you're ready!</p>
              <img className="Result__image" src={successImage} alt=""/>
              <a href={videoUrl} download>
                <Button className="Result__download" type="primary" style={{ display: "block", margin: "0 auto", borderRadius: "8px" }}>Download video</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result;