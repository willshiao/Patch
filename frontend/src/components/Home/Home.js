import React from 'react';
import './Home.scss';
import logo from '../../assets/imgs/patch_logo.svg';
import landing from "../../assets/imgs/landing1.svg";

function Home() {
  return (
    <div className="Home">
      <div className="container-fluid">
      	<div className="TopNavBar">
          <nav class="navbar fixed-top navbar-expand-md navbar-light bg-none">
          <a className="navbar-brand" href="Home.js"><img id="logo" src={logo} alt="Patch" style ={{width: "124px"}}></img></a>
          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="Home.js"><b>About</b></a></li>
            <li className="nav-item">
              <a className="nav-link" href="#"><b>Motivation</b></a></li>
            <li className="nav-item">
              <a className="nav-link" href="#"><b>How it Works</b></a></li>
          </ul>
          <button type="button" class="btn btn-dark"><b>View on Github</b></button>
      </nav>
      </div>
      </div>
      

      <div className="container-fluid">
        <div class="row">
          <div class="col-5">
            <hr></hr>
            <h1><b>The quick fix <br></br>for your choppy <br></br><i>Zoom</i> audio.</b></h1>
            <p>Posting a video with audio defects? We'll<br></br>make uploading it the hardest part.</p>
          </div>
          <div class="col-7">
            <div id="Image">
              <img src={landing} alt="Photo"></img>
            </div>
          </div>

        </div>
      </div>
    </div>

  )
}

export default Home;