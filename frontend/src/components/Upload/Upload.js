import React, { useState, useCallback } from 'react';
import './Upload.scss';
import { useDropzone } from 'react-dropzone';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { mockData } from '../../mocks';
import axios from 'axios';
import logo from '../../assets/imgs/patch_logo.svg';
import videoOne from '../../assets/imgs/upload1_normal.svg';
import check from '../../assets/imgs/upload1_done.svg';
import audioOne from '../../assets/imgs/upload2_disabled.svg';

function Upload() {
  // States
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // Video drag 'n' drop
  const onVideoDrop = useCallback(acceptedFiles => {
    const videoFile = acceptedFiles[0]
    setVideoFile(videoFile);
  }, []);
  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive
  } = useDropzone({ onDrop: onVideoDrop });

  // Audio drag 'n' drop
  const onAudioDrop = useCallback(acceptedFiles => {
    const audioFile = acceptedFiles[0]
    setAudioFile(audioFile);
  }, []);
  const {
    getRootProps: getAudioRootProps,
    getInputProps: getAudioInputProps,
    isDragActive: isAudioDragActive
  } = useDropzone({ onDrop: onAudioDrop });

  // Upload both files
  const handleUpload = e => {
    e.preventDefault();

    const formData = new FormData();

    console.log("Appending to form", videoFile, audioFile);

    formData.append("videoFile", videoFile);
    formData.append("audioFile", audioFile);

    axios({
      method: 'post',
      url: `${BASE_URL}/`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log("I got a response from backend: ", response);
        setData(mockData);
      })
      .catch(error => {
        console.log("ERRORRRRRRR", error);
      })
  }

  if (data) {
    return (
      <Redirect push to={{
        pathname: '/result',
        state: { data }
      }}/>
    );
  }

  return (
    <div className="Upload">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-5">
            <img className="Upload__logo" src={logo} alt="Patch"/>
          </div>
          <div className="col-5"></div>
        </div>
        <div className="row justify-content-center">
          <div className="col-5">
            <div className="Upload__videoBadgeContainer">
              <img className="Upload__videoBadge" src={videoFile ? check : videoOne} alt=""/>
            </div>
            <div className="Upload__videoInfoContainer" style={videoFile ? { backgroundColor: "#eafeef" } : { backgroundColor: "#dfeeff" }}>
              <p className="Upload__videoInfoCaption" style={videoFile ? { color: "#72CF97" } : { color: "#2D8CFF" }}>
                Upload your video file with “bad” audio.
              </p>
              <p className="Upload__videoInfoSubCaption">
                Acceptable file types: .mp4, .mov
              </p>
            </div>
            <div className="Upload__videoContainer">
              {
                videoFile ? (
                  <div>
                    <p>{videoFile.name}</p>
                  </div>
                ) : (
                  <div className="Upload__video" {...getVideoRootProps()}>
                    {/* <input {...getVideoInputProps()} /> */}
                    {
                      isVideoDragActive ? (
                        <p>Drop the file here</p>
                      ) : (
                        <div>
                          <p className="Upload__videoText">Drag ‘n’ drop your video file here</p>
                          <p className="Upload__videoText--or">or</p>
                          <Button type="primary" className="Upload__videoBrowse" style={{ borderRadius: "8px" }}>Browse files</Button>
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className="col-5">
            <div className="Upload__audioBadgeContainer">
              <img className="Upload__audioBadge" src={audioFile ? check : audioOne} alt=""/>
            </div>
            <div className="Upload__audioInfoContainer" style={audioFile ? { backgroundColor: "#eafeef" } : { backgroundColor: "#f0f3f6" }}>
              <p className="Upload__audioInfoCaption" style={audioFile ? { color: "#72CF97" } : { color: "#868686" }}>
                Upload your “completely fine” audio file.
              </p>
              <p className="Upload__audioInfoSubCaption">
                Acceptable file types: .mp3, .m4a
              </p>
            </div>
            <div className="Upload__audioContainer">
            {
                audioFile ? (
                  <div>
                    <p>{audioFile.name}</p>
                  </div>
                ) : (
                  <div className="Upload__audio" {...getAudioRootProps()}>
                    {/* <input {...getVideoInputProps()} /> */}
                    {
                      isAudioDragActive ? (
                        <p>Drop the file here</p>
                      ) : (
                        <div>
                          <p className="Upload__audioText">Drag ‘n’ drop your audio file here</p>
                          <p className="Upload__audioText--or">or</p>
                          <Button type="primary" className="Upload__audioBrowse" style={{ borderRadius: "8px" }}>Browse files</Button>
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {
          videoFile && audioFile &&
            <div className="row justify-content-center">
              <div className="col-2">
                <Button className="Upload__button" loading={isLoading} type="primary" onClick={handleUpload} style={{ display: "block", margin: "0 auto", marginTop: "128px" }}>Upload</Button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Upload;