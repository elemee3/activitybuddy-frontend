import React, { Component } from 'react';
import { getActivity } from '../../services/clientToBackend';
import { Button, ButtonToolbar } from 'react-bootstrap';

class ShowActivities extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: {},
      deleteSuccess: false
    }
  }
  //add image and description from database
  render() {
    return (
      <div className="App">

        {this.state.activity === {}
        ? <div>No Activity Selected</div>
        : <div>
            {this.state.activity.name}<br />
            {this.state.activity.description}
          </div>}

      </div>
    );
  }

  componentDidMount() {
    let index = this.props.activityId
    getActivity(index)
    .then(activity => {
      this.setState({
        activity
      })
    })
    .catch(err => {
      console.log('ERROR::', err)
    })
  }
}

export default ShowActivities;
