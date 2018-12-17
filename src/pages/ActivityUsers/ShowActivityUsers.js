import React, { Component } from 'react';
// import { getActivityUsers } from '../../services/clientToBackend';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
const apiKey = 'AIzaSyDPJJChG0F7S36LTQrSy00ZwwDIZdVeghw'


class ActivityUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentUserCoordinates: {},
      buddies: [],
      buddiesCoordinates: [],
      center: {
        lat: 32.7096422,    //default downtown San Diego
        lng: -117.1579546
      },
      distances: [],
      orderedBuddies: []
    }
  }

  locateBuddies = () => {
    let buddies = []
    return this.state.buddies.map(buddy => {
      let address = `${buddy.address1} ${buddy.city} ${buddy.state} ${buddy.zipcode}`
      this.determineBuddyMarker(address)
      .then(json => {
        buddies.push(json.results[0].geometry.location)
        this.setState({
          buddiesCoordinates: buddies
        })
      })
    })
  }

  determineBuddyMarker = (address) => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    return fetch(url + '?address=' + address + '&key=' + apiKey)
    .then(resp => {
      let json = resp.json()
      return json
    })
    .catch(err => {
      console.log(err)
    })
  }

  showBuddyMarkers = () => {
    return this.state.buddiesCoordinates.map(buddyCoordinates => {
      return (
        <Marker id={"Buddy"} position={buddyCoordinates} />
      )
    })
  }

  // determineUserMarker() sets this.state.currentUserCoordinates based on this.state.currentUser
  determineUserMarker = () => {
    let { currentUser } = this.state
    const address = `${currentUser.address1} ${currentUser.city} ${currentUser.state} ${currentUser.zipcode}`
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    fetch(url + '?address=' + address + '&key=' + apiKey)
    .then(resp => {
      let json = resp.json()
      return json
    })
    .then(json => {
      this.setState({
        currentUserCoordinates: json.results[0].geometry.location // <-- to get obj containing lat/lng
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  // showUserMarker() runs when this.state.user is populated with lat/lng object
  showUserMarker = () => {
    return (
      <Marker
        id={"User"}
        position={this.state.currentUserCoordinates}
        icon={{
          url: 'https://i.imgur.com/XmTOxBK.png'
        }}
      />
    )
  }


  getDistances = () => {
    let buddiesLocations = this.state.buddies.map(buddy => {
      return `${buddy.address1} ${buddy.city} ${buddy.state} ${buddy.zipcode}`
    })
    let originPoints = []
    for (let i = 0; i < buddiesLocations.length; i++) {
        originPoints[i] = this.state.currentUserCoordinates
    }

    const service = new this.props.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: originPoints,
        destinations: buddiesLocations,
        travelMode: 'DRIVING',
      },
      this.showDistances
    );
  }
  // callback function passed to getDistances()
  showDistances = (response, status) => {
    let { buddies } = this.state
    if (status === 'OK') {
      const numOfResults = response.rows[0].elements.length
      for (let i = 0; i < numOfResults; i ++) {
        buddies[i].distance = Math.floor(response.rows[0].elements[i].distance.value / 1609.344)      // response comes in meters, convert to miles
      }
      this.setState({ buddies })
    }
  }

  sortBuddiesByDistances = (e) => {
    e.preventDefault()
    let ordered = this.state.buddies.sort(function (a, b) {
      return a.distance - b.distance
    })
    this.setState({ buddies: ordered })
  }


  render() {

    return (
      <div className="App">
        <div className="Current">
          <h3>Current User</h3>
          {!this.state.currentUser.name ? <div>Current User Not Found</div> :
            <div>{this.state.currentUser.name}, {this.state.currentUser.email}<br/>
              Address: {this.state.currentUser.address1} {this.state.currentUser.city}, {this.state.currentUser.state} {this.state.currentUser.zipcode}
            </div>
          }
        </div>

        <div className="List">
          <h3>Activity Buddies</h3>
          <form>
            <input type="submit" value="Sort Buddies" onClick={this.sortBuddiesByDistances} />
          </form>
          {this.state.buddies.length === 0 ? <div>No Users Found</div> :
            this.state.buddies.map((buddy, id) => {
              return (
                <div>
                  {id+1}. {buddy.name}, {buddy.email}<br/>
                  Distance: {buddy.distance} miles
                </div>
              )
            })
          }
        </div>

        <div className="map">
          <Map
          google={this.props.google}
          style={{ maxHeight: '500px', maxWidth: '500px', height: '75vh', width: '70%', margin: '0 auto' }}
          initialCenter={this.state.center}
          zoom={11}
          >
            {this.state.currentUserCoordinates.lat ? this.showUserMarker() : this.determineUserMarker()}
            {this.state.buddiesCoordinates[0] ? this.showBuddyMarkers() : this.locateBuddies()
            }
            {this.state.distances.length === 0 ? this.getDistances() : ''}
          </Map>
        </div>
      </div>
    )
  }

  componentDidMount() {
    const activity_id = this.props.match.params.id
    if (activity_id === "1") {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'}, { id: 2, name:'Dennis', email: 'tester123@example.com', address1: '3288 Adams Ave', city: 'San Diego', state: 'California', zipcode: '92116'}]
      })
    } else if (activity_id === "2") {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 5, name:'Frank', email: 'tester123@example.com', address1: '3911 Cleveland Ave', city: 'San Diego', state: 'California', zipcode: '92103'}, { id: 6, name:'Gail', email: 'tester123@example.com', address1: '6519 Bisby Lake Ave', city: 'San Diego', state: 'California', zipcode: '92119'}, { id: 2, name:'Dennis', email: 'tester123@example.com', address1: '3288 Adams Ave', city: 'San Diego', state: 'California', zipcode: '92116'}]
      })
    } else if (activity_id === "3") {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 3, name:'Charlie', email: 'tester123@example.com', address1: '4740 Mission Gorge Pl', city: 'San Diego', state: 'California', zipcode: '92120'}, { id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'}, { id: 2, name:'Dennis', email: 'tester123@example.com', address1: '3288 Adams Ave', city: 'San Diego', state: 'California', zipcode: '92116'}]
      })
    } else if (activity_id === "4") {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 4, name:'Dee', email: 'tester123@example.com', address1: '815 E St', city: 'San Diego', state: 'California', zipcode: '92101'}, { id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'}]
      })
    } else if (activity_id === "5") {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 5, name:'Frank', email: 'tester123@example.com', address1: '3911 Cleveland Ave', city: 'San Diego', state: 'California', zipcode: '92103'}, { id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'}, { id: 6, name:'Gail', email: 'tester123@example.com', address1: '6519 Bisby Lake Ave', city: 'San Diego', state: 'California', zipcode: '92119'}]
      })
    } else {
      this.setState({
        currentUser: {id: 1, name:'Mac', email: 'tester123@example.com', address1: '4193 University Ave', city: 'San Diego', state: 'California', zipcode: '92105'},
        buddies: [{ id: 6, name:'Gail', email: 'tester123@example.com', address1: '6519 Bisby Lake Ave', city: 'San Diego', state: 'California', zipcode: '92119'}]
      })
    }

    // it might be better to use componentDidMount() for loading the current user instead of the buddy list. if so, the buddy list can be loaded in the ternary statement of displaying the buddies on the map

    // getActivityUsers(activity_id)
    // .then(json => {
    //   this.setState({
    //     users: json
    //   })
    // })
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyDPJJChG0F7S36LTQrSy00ZwwDIZdVeghw')
})(ActivityUsers);
