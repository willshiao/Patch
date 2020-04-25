import React, { useState, useCallback } from 'react';
import './Upload.scss';
import { useDropzone } from 'react-dropzone';
import { Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { mockData } from '../../mocks';
import logo from '../../assets/imgs/patch_logo.svg';

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
  const handleUpload = () => {
    const formData = new FormData();

    console.log("Appending to form", videoFile, audioFile);

    formData.append("videoFile", videoFile);
    formData.append("audioFile", audioFile);

    setData(mockData);
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
            <div className="Upload__videoContainer" {...getVideoRootProps()}>
              {/* <input {...getVideoInputProps()} /> */}
              {
                isVideoDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag ‘n’ drop your video file here</p>
              }
              {
                videoFile && 
                  <div>
                    <p>{videoFile.name}</p>
                  </div>
              }
            </div>
          </div>
          <div className="col-5">
            <div className="Upload__videoContainer" {...getAudioRootProps()}>
              {/* <input {...getAudioInputProps()} /> */}
              {
                isAudioDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag ‘n’ drop your audio file here</p>
              }
              {
                audioFile && 
                  <div>
                    <p>{audioFile.name}</p>
                  </div>
              }
            </div>
          </div>
        </div>
        {
          videoFile && audioFile &&
            <div className="row justify-content-center">
              <div className="col-2">
                <Button type="primary" onClick={handleUpload}>Upload</Button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Upload;