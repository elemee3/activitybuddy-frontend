import React, { Component } from 'react';
import { getUser } from '../../services/clientToBackend';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
const apiKey = 'AIzaSyDPJJChG0F7S36LTQrSy00ZwwDIZdVeghw'

export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      userCoordinates: {},
      center: {
        lat: 32.7096422,    //default downtown San Diego
        lng: -117.1579546
      }
    }
  }

  // determineUserMarker() runs once on load to set this.state.userCoordinates
  determineUserMarker = () => {
    let { user } = this.state
    const address = `${user.address1} ${user.city} ${user.state} ${user.zipcode}`
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    fetch(url + '?address=' + address + '&key=' + apiKey)
    .then(resp => {
      let json = resp.json()
      return json
    })
    .then(json => {
      this.setState({
        userCoordinates: json.results[0].geometry.location // <-- to get obj containing lat/lng
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  // showUser() runs when this.state.user is populated with lat/lng object
  showUser = () => {
    return (
      <Marker id={"User"} position={this.state.userCoordinates} />
    )
  }

  render() {
    return (
      <div className="mapPage">
        <div className="App">
          {!this.state.user.email ? <div>User Not Found</div> :
          <div>
            Email: {this.state.user.email}<br/>
            Address: {this.state.user.address1} {this.state.user.city}, {this.state.user.state} {this.state.user.zipcode}
          </div>}
        </div>

        <br/>

        <div className="map">
          <Map
          google={this.props.google}
          style={{ maxHeight: '500px', maxWidth: '500px', height: '75vh', width: '70%', margin: '0 auto' }}
          initialCenter={this.state.center}
          zoom={11}
          >
            {this.state.userCoordinates.lat ? this.showUser() : this.determineUserMarker()}
          </Map>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let index = this.props.match.params.id
    getUser(index)
    .then(user => {
      this.setState({ user })
    })
    .catch(err => {
      console.log('ERROR::', err)
    })
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyDPJJChG0F7S36LTQrSy00ZwwDIZdVeghw')
})(MapContainer)
