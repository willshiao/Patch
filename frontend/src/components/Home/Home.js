import React, { useState } from 'react';
import './Home.scss';
import { Button } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
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
import { content } from '../../content';

const { home } = content;

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
                  <NavLink href="/about">{home.navbar.about}</NavLink>
                </Link>
              </NavItem>
              <NavItem className="Home__navItem">
                <Link activeClass="active" to="how" spy smooth duration={700}>
                  <NavLink href="/how">{home.navbar.how}</NavLink>
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
                <h1 className="Home__caption">{home.title.caption}</h1>
                <p className="Home__subcaption">{home.title.subcaption}</p>
                <div className="Home__buttonGroup">
                  <RouterLink to="/upload">
                    <Button type="primary" style={{ marginRight: "16px", borderRadius: "8px" }}>Get Patchin'</Button>
                  </RouterLink>
                  <a href="https://github.com/willshiao/Patch">
                    <Button ghost style={{ borderRadius: "8px", color: "#000", borderColor: "#000", borderWidth: "2px" }}>View on GitHub</Button>
                  </a>
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
                  <h1 className="Home__aboutTitle">{home.about.title}</h1>
                  <p className="Home__aboutDescription">
                    {home.about.description}
                  </p>
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
                <h1 className="Home__howTitle">{home.how.title}</h1>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-2">
                <img className="Home__howIcon" src={sound} alt="sound"/>
                <p className="Home__howDescription">{home.how.descriptionFirst}</p>
              </div>
              <div className="col-2">
                <img className="Home__howIcon" src={upload} alt="upload"/>
                <p className="Home__howDescription">{home.how.descriptionSecond}</p>
              </div>
              <div className="col-2">
                <img className="Home__howIcon" src={happy} alt="happy"/>
                <p className="Home__howDescription">{home.how.descriptionThird}</p>
              </div>
            </div>
          </div>
        </Element>
      </div>
    </div>

  )
}

export default Home;