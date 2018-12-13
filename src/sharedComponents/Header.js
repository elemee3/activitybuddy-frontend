import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import AuthService from '../services/AuthService';
import { LinkContainer } from 'react-router-bootstrap'

class Header extends Component {
  constructor(props) {
    super(props)

    this.auth = new AuthService()
  }

  loginLogoutButton = () => {
    if(!this.auth.loggedIn()) {
      return(
        <Nav pullRight>

          <LinkContainer to="/register">
            <NavItem eventKey={3}>
              Register
            </NavItem>
          </LinkContainer>

          <LinkContainer to="/login">
            <NavItem eventKey={4}>
              Log-In
            </NavItem>
          </LinkContainer>

        </Nav>
      )
    } else {
      return (
        <Nav pullRight>

          <LinkContainer to="/myprofile">
            <NavItem eventKey={3}>
              View Profile
            </NavItem>
          </LinkContainer>

          <LinkContainer to="/about">
            <NavItem eventKey={4} onClick={this.auth.logout}>
              Log-Out
            </NavItem>
          </LinkContainer>

        </Nav>
      )
    }
  }

  render() {
    return (
      <Navbar>

        <Navbar.Header>
          <Navbar.Brand>

          <LinkContainer to="/about">
            <div>Activity Buddy</div>
          </LinkContainer>

          </Navbar.Brand>
        </Navbar.Header>

        <Nav>
          <LinkContainer to="/about">
            <NavItem eventKey={1}>
              About
            </NavItem>
          </LinkContainer>

          <LinkContainer to="/activities">
            <NavItem eventKey={2}>
              See All Activities
            </NavItem>
          </LinkContainer>

          <LinkContainer to="/activities/new">
            <NavItem eventKey={2}>
              Create Activity
            </NavItem>
          </LinkContainer>

        </Nav>

        {this.loginLogoutButton()}

      </Navbar>
    );
  }

}

export default Header;
