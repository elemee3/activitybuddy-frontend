import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import List from './pages/Activities/List';
import ShowActivity from './pages/Activities/ShowActivity';
import Login from './pages/Users/Login';
import Register from './pages/Users/Register';

import Header from './sharedComponents/Header';
import Footer from './sharedComponents/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
            <Router>
                <Switch>
                  <Route exact path="/activities/:id" component={ShowActivity} />
                  <Route exact path="/activities" component={List} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
