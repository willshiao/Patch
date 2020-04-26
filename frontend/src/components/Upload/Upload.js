import React, { useState, useCallback, useRef } from 'react';
import './Upload.scss';
import { useDropzone } from 'react-dropzone';
import { Button, Modal } from 'antd';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { mockData } from '../../mocks';
import axios from 'axios';
import logo from '../../assets/imgs/patch_logo.svg';
import videoOne from '../../assets/imgs/upload1_normal.svg';
import check from '../../assets/imgs/upload1_done.svg';
import audioOne from '../../assets/imgs/upload2_normal.svg';
import errorImage from '../../assets/imgs/upload_error.svg';

function Upload() {
  // States
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [data, setData] = useState(null);
  const [hasUploadError, setHasUploadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Input tag refs
  const inputVideoFile = useRef(null);
  const inputAudioFile = useRef(null);

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

    setTimeout(() => setData(mockData), 1000);

    // axios({
    //   method: 'post',
    //   url: `${BASE_URL}/blahblah`,
    //   data: formData,
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    //   .then(response => {
    //     console.log("I got a response from backend: ", response);
    //     setData(mockData);
    //   })
    //   .catch(error => {
    //     setHasUploadError(true);
    //     console.log("ERRORRRRRRR", error);
    //   })
  }

  if (data) {
    return (
      <Redirect push to={{
        pathname: '/result',
        state: { data }
      }}/>
    );
  }
  
  const handleVideoFileCancel = e => {
    e.preventDefault();
    setVideoFile(null);
  }

  const handleAudioFileCancel = e => {
    e.preventDefault();
    setAudioFile(null);
  }

  const handleBrowseVideoClick = () => {
    inputVideoFile.current.click();
  }

  const handleVideoFileChange = e => {
    const videoFile = e.target.files[0];
    setVideoFile(videoFile);
  }

  const handleBrowseAudioClick = () => {
    inputAudioFile.current.click();
  }

  const handleAudioFileChange = e => {
    const audioFile = e.target.files[0];
    setAudioFile(audioFile);
  }

  const closeModal = () => setHasUploadError(false);

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
                  <div className="Upload__videoSelected">
                    <p className="Upload__fileName">{videoFile.name}</p>
                    <Button type="primary" onClick={handleVideoFileCancel} style={{ display: "block", margin: "0 auto", borderRadius: "8px", backgroundColor: "#FF7474" }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="Upload__video" {...getVideoRootProps()}>
                    {
                      isVideoDragActive ? (
                        <p className="Upload__drop">Drop the file here</p>
                      ) : (
                        <div>
                          <p className="Upload__videoText">Drag ‘n’ drop your video file here</p>
                          <p className="Upload__videoText--or">or</p>
                          <Button type="primary" className="Upload__videoBrowse" onClick={handleBrowseVideoClick} style={{ borderRadius: "8px" }}>Browse files</Button>
                          <input type="file" id="hidden" ref={inputVideoFile} onChange={handleVideoFileChange} style={{display: 'none'}} /> 
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
            <div className="Upload__audioInfoContainer" style={audioFile ? { backgroundColor: "#eafeef" } : { backgroundColor: "#dfeeff" }}>
              <p className="Upload__audioInfoCaption" style={audioFile ? { color: "#72CF97" } : { color: "#2D8CFF" }}>
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
                    <p className="Upload__fileName">{audioFile.name}</p>
                    <Button type="primary" onClick={handleAudioFileCancel} style={{ display: "block", margin: "0 auto", outline: "none", borderRadius: "8px", backgroundColor: "#FF7474" }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="Upload__audio" {...getAudioRootProps()}>
                    {
                      isAudioDragActive ? (
                        <p className="Upload__drop">Drop the file here!</p>
                      ) : (
                        <div>
                          <p className="Upload__audioText">Drag ‘n’ drop your audio file here</p>
                          <p className="Upload__audioText--or">or</p>
                          <Button type="primary" className="Upload__audioBrowse" onClick={handleBrowseAudioClick} style={{ borderRadius: "8px" }}>Browse files</Button>
                          <input type="file" id="hidden" ref={inputAudioFile} onChange={handleAudioFileChange} style={{display: 'none'}} /> 
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
        <Modal
          visible={hasUploadError}
          onCancel={closeModal}
          width={640}
          footer={null}
          centered
          className="Upload__modal"
        >
          <img className="Upload__errorImage" src={errorImage} alt=""/>
          <h1 className="Upload__errorTitle">UH-OH!</h1>
          <p className="Upload__errorMessage">There was an error uploading your files! Please refresh the page and try again!</p>
        </Modal>
      </div>
    </div>
  )
}

export default Upload;