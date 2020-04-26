import React, { useState } from 'react';
import './Home.scss';
import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Link, Element } from 'react-scroll';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import logo from '../../assets/imgs/patch_logo.svg';
import landing from "../../assets/imgs/landing1.svg";
import line from '../../assets/imgs/line.svg';
import whiteLine from '../../assets/imgs/white_line.svg';
import about from '../../assets/imgs/landing2.png';
import sound from '../../assets/imgs/landing_how1.svg';
import upload from '../../assets/imgs/landing_how2.svg';
import happy from '../../assets/imgs/landing_how3.svg';

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="Home">
      <div className="container-fluid p-0">
        <Navbar light expand="md">
          <NavbarBrand className="Home__navbarBrand" href="/">
            <img className="Home__navbarLogo" src={logo} alt=""/>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto Home__nav" navbar>
              <NavItem className="Home__navItem">
                <Link activeClass="active" to="about" spy smooth duration={700}>
                  <NavLink href="/about">About</NavLink>
                </Link>
              </NavItem>
              <NavItem className="Home__navItem">
                <Link activeClass="active" to="how" spy smooth duration={700}>
                  <NavLink href="/how">How</NavLink>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div className="Home__title">
          <div className="row justify-content-center">
            <div className="col-4">
              <div className="Home__landingText">
                <img className="Home__line" src={line} alt="break"/>
                <h1 className="Home__caption">The quick fix for your choppy <em>Zoom</em> audio.</h1>
                <p className="Home__subcaption">Posting a video with audio defects? We'll make uploading it the hardest part.</p>
                <div className="Home__buttonGroup">
                  <Button type="primary" style={{ marginRight: "16px", borderRadius: "8px" }}>Get Patchin'</Button>
                  <Button ghost icon={<GithubOutlined style={{ marginTop: "-10px"}} />} style={{ borderRadius: "8px", color: "#000", borderColor: "#000", borderWidth: "2px" }}>View on GitHub</Button>
                </div>
              </div>
            </div>
            <div className="col-4">
              <img className="Home__landingImage" src={landing} alt="Landing"/>
            </div>
          </div>
        </div>
        <Element name="about">
          <div className="Home__about">
            <div className="row justify-content-center">
              <div className="col-4">
                <img className="Home__aboutImage" src={about} alt="about"/>
              </div>
              <div className="col-5">
                <div className="Home__aboutText">
                  <img className="Home__line" src={whiteLine} alt="break"/>
                  <h1 className="Home__aboutTitle">About</h1>
                  <p className="Home__aboutDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
              </div>
            </div>
          </div>
        </Element>
        <Element name="how">
          <div className="Home__how">
            <div className="row justify-content-center">
              <div className="col-6">
                <img className="Home__line" src={line} alt="break"/>
                <h1 className="Home__howTitle">How it Works</h1>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-2">
                <img className="Home__howIcon" src={sound} alt="sound"/>
                <p className="Home__howDescription">Before you start recording your Zoom meeting, make sure to begin recording your own voice. This could be done through an external application on your phone, computer, etc. As long as you provide an [list acceptable file types], you’re good to go!</p>
              </div>
              <div className="col-2">
                <img className="Home__howIcon" src={upload} alt="upload"/>
                <p className="Home__howDescription">Have both your video file with corrupt audio and completely normal audio file ready to upload. All you need to do is drag and drop them (or browse and select the files if you want to make your life a little harder).</p>
              </div>
              <div className="col-2">
                <img className="Home__howIcon" src={happy} alt="happy"/>
                <p className="Home__howDescription">See your brand-new Zoom video in action! Before you choose to download it, you’ll have the option to watch the video and discover what we were able to find out about it. Want to patch another one? Please, be our guest.</p>
              </div>
            </div>
          </div>
        </Element>
      </div>
    </div>

  )
}

export default Home;