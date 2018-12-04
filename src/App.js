import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import ActivityIndex from './pages/Activities/List';
import ShowActivities from './pages/Activities/ShowActivity';

import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
            <Router>
                <Switch>
                  <Route exact path="/activities/:id" component={ShowActivities} />
                  <Route exact path="/activities" component={ActivityIndex} />
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
