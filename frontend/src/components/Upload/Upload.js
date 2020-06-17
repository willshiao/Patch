import React, { useState, useCallback, useRef } from 'react';
import './Upload.scss';
import { useDropzone } from 'react-dropzone';
import { useToasts } from 'react-toast-notifications';
import { Button, Modal } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import { BASE_URL, NUM_FILES_ERROR, INVALID_FILE_ERROR, videoFileTypes, audioFileTypes } from '../../constants';
import { mockData } from '../../mocks';
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import logo from '../../assets/imgs/patch_logo.svg';
import videoOne from '../../assets/imgs/upload1_normal.svg';
import check from '../../assets/imgs/upload1_done.svg';
import audioOne from '../../assets/imgs/upload2_normal.svg';
import errorImage from '../../assets/imgs/upload_error.svg';
import bars from '../../assets/imgs/bars.svg';
import { content } from '../../content';

const { upload } = content;

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

  // Toast notification
  const { addToast } = useToasts();

  // Video drag 'n' drop
  const onVideoDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 1) {
      addToast(NUM_FILES_ERROR, { appearance: 'error' });
      return;
    }

    const videoFile = acceptedFiles[0];
    setVideoFile(videoFile);
  }, []);
  const {
    getRootProps: getVideoRootProps,
    isDragActive: isVideoDragActive
  } = useDropzone({ onDrop: onVideoDrop });

  // Audio drag 'n' drop
  const onAudioDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 1) {
      addToast(NUM_FILES_ERROR, { appearance: 'error' });
      return;
    }
    
    const audioFile = acceptedFiles[0];
    setAudioFile(audioFile);
  }, []);
  const {
    getRootProps: getAudioRootProps,
    isDragActive: isAudioDragActive
  } = useDropzone({ onDrop: onAudioDrop });

  // Upload both files
  const handleUpload = e => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
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
        const { data } = response;
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        setHasUploadError(true);
        setIsLoading(false);
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
    const { files } = e.target;
    if (files.length > 1) {
      addToast(NUM_FILES_ERROR, { appearance: 'error' });
      return;
    }

    const videoFile = files[0];
    setVideoFile(videoFile);
  }

  const handleBrowseAudioClick = () => {
    inputAudioFile.current.click();
  }

  const handleAudioFileChange = e => {
    const { files } = e.target;
    if (files.length > 1) {
      addToast(NUM_FILES_ERROR, { appearance: 'error' });
      return;
    }

    const audioFile = e.target.files[0];
    setAudioFile(audioFile);
  }

  const closeModal = () => setHasUploadError(false);

  return (
    <div className="Upload">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-5">
            <Link to="/">
              <img className="Upload__logo" src={logo} alt="Patch"/>
            </Link>
          </div>
          <div className="col-5"></div>
        </div>
        <div className="row justify-content-center">
          <div className="col-5">
            <div className="Upload__videoBadgeContainer">
              <img className="Upload__videoBadge" src={videoFile ? check : videoOne} alt=""/>
            </div>
            <div className="Upload__videoInfoContainer" style={videoFile ? { backgroundColor: "#eafeef" } : { backgroundColor: "#dfeeff" }}>
              <p className="Upload__videoInfoCaption" style={videoFile ? { color: "#72CF97" } : { color: "#2D8CFF" }}>{upload.videoCaption}</p>
              <p className="Upload__videoInfoSubCaption">{upload.videoFileTypes}</p>
            </div>
            <div className="Upload__videoContainer">
              {
                videoFile ? (
                  <div className="Upload__videoSelected">
                    <p className="Upload__fileName">{videoFile.name}</p>
                    <Button type="primary" disabled={isLoading} onClick={handleVideoFileCancel} style={{ display: "block", margin: "0 auto", border: "none", borderRadius: "8px", backgroundColor: "#FF7474" }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="Upload__video" {...getVideoRootProps()}>
                    {
                      isVideoDragActive ? (
                        <p className="Upload__drop">{upload.drop}</p>
                      ) : (
                        <div>
                          <p className="Upload__videoText">{upload.dropVideo}</p>
                          <p className="Upload__videoText--or">{upload.or}</p>
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
              <p className="Upload__audioInfoCaption" style={audioFile ? { color: "#72CF97" } : { color: "#2D8CFF" }}>{upload.audioCaption}</p>
              <p className="Upload__audioInfoSubCaption">{upload.audioFileTypes}</p>
            </div>
            <div className="Upload__audioContainer">
            {
                audioFile ? (
                  <div>
                    <p className="Upload__fileName">{audioFile.name}</p>
                    <Button type="primary" disabled={isLoading} onClick={handleAudioFileCancel} style={{ display: "block", margin: "0 auto", border: "none", borderRadius: "8px", backgroundColor: "#FF7474" }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="Upload__audio" {...getAudioRootProps()}>
                    {
                      isAudioDragActive ? (
                        <p className="Upload__drop">{upload.drop}</p>
                      ) : (
                        <div>
                          <p className="Upload__audioText">{upload.dropAudio}</p>
                          <p className="Upload__audioText--or">{upload.or}</p>
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
          videoFile && audioFile && !isLoading &&
            <div className="row justify-content-center">
              <div className="col-2">
                <Button className="Upload__button" type="primary" onClick={handleUpload} style={{ display: "block", margin: "0 auto", marginTop: "64px", borderRadius: "8px" }}>{upload.button}</Button>
              </div>
            </div>
        }
        {
          isLoading &&
            <div className="Upload__loadingContainer">
              <img className="Upload__loading" src={bars} alt="Loading..."/>
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
          <h1 className="Upload__errorTitle">{upload.error.title}</h1>
          <p className="Upload__errorMessage">{upload.error.mainMessage}</p>
          <ul className="Upload__errorList">
            <li className="Upload__errorListItem">{upload.error.invalidFile}</li>
            <li className="Upload__errorListItem">{upload.error.audioShort}</li>
            <li className="Upload__errorListItem">{upload.error.audioDifferent}</li>
            <li className="Upload__errorListItem">{upload.error.timeout}</li>
          </ul>
        </Modal>
      </div>
    </div>
  )
}

export default Upload;