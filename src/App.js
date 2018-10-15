import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Map from './components/Map'
import Search from "./components/Search";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 35.0844,
        lng: -106.6504
      },
      zoom: 13,
      map: '',
      info: '',
      venues: [],
      listedMarkers: [],
      highlightedIcon: null,
      querySelector: 'food',
      client_id: "YCMGPBOPZCPOG4QYVXZ4ETGY5TLVNO34BGYAZ1NNKA3T44KS",
      client_secret: "EKIC4ZUG3DJJGATRLZA2WO1W3X5L204BHM0XG2RE5IGP0GK5"
    };

    this.initMap = this.initMap.bind(this);
    this.onclickLocation = this.onclickLocation.bind(this)
  }

  gm_authFailure() {
    window.alert("Google Maps error!")
  }
  //do not do initMap in this component as we won't have venues then
  componentDidMount() {
    window.gm_authFailure = this.gm_authFailure;
    // this.updateQuery()
    // this.getVenues()
    this.stateSet()
    this.onclickLocation()
  }

  renderMap = () => {
    loadMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyAdlFJbHfXSdxy03hESWwqCu5z5xzEfCTw&callback=initMap")
    window.initMap = this.initMap
    // window.initAutocomplete = this.initAutocomplete
  }

  //to get venues from foursquare
  getVenues = async () => {
    try {
      return await
      axios.get('https://api.foursquare.com/v2/venues/explore?client_id=YCMGPBOPZCPOG4QYVXZ4ETGY5TLVNO34BGYAZ1NNKA3T44KS&client_secret=EKIC4ZUG3DJJGATRLZA2WO1W3X5L204BHM0XG2RE5IGP0GK5&query=food&near=Albuquerque&v=20180903')
    } catch (error) {
      window.alert(`${error}, can't connect to foursquare`)
    }
  }

  stateSet = async () => {
    const get = await this.getVenues()
    if (get){
    this.setState({
      venues: get.data.response.groups[0].items,
    }, this.renderMap())
      // window.alert(get)
      // console.log(get.data.response.groups[0].items)
    }
  }
  getVenuesOLD = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: this.state.client_id,
      client_secret: this.state.client_secret,
      query: this.state.querySelector,
      // categoryId: this.state.querySelector,
      near: "Albuquerque",
      v: "20180903"
    }

    axios.get(endPoint + new URLSearchParams(parameters)).then(response => {
      this.setState({
        venues: response.data.response.groups[0].items
      }, this.renderMap())
      //response.data.response.groups[0].items
    }).catch(error => {
      window.alert(`${error}, can't connect to foursquare`)
      // console.log("ERROR! " + error)
    })
  }

  initMap() {
    let map;
    map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: this.state.zoom,
      center: this.state.center
    });

    const infowindow = new window.google.maps.InfoWindow({});

    this.setState({map: map, info: infowindow});

    this.state.venues.forEach(fsVenue => {

      let contentString = `${fsVenue.venue.name} , ${fsVenue.venue.location.address}`

      const markerLocation = {
        lat: fsVenue.venue.location.lat,
        lng: fsVenue.venue.location.lng
      }
      //creating the custom marker icon
      let iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      let marker = new window.google.maps.Marker({
        position: markerLocation,
        map: map,
        title: fsVenue.venue.name,
        icon: iconBase + 'dining.png'
      });

      marker.addListener('click', function() {
        // console.log(markerLocation)

        marker.setAnimation(window.google.maps.Animation.BOUNCE, 1000);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 1500);
        infowindow.setContent(contentString)
        infowindow.open(map, marker)
        //need to move a center of a map to the marker position
        let newMarkerCenter = new window.google.maps.LatLng(markerLocation);
        map.setCenter(newMarkerCenter)
      });

      // push markers into the array
      let listedMarker = this.state.listedMarkers;
      if (!listedMarker.includes(marker)) {
        listedMarker.push(marker);
      }

      this.setState({listedMarkers: listedMarker});

    });
  }

  pause = (e, k) => {
    setTimeout(function() {
      e.target.style.color = k;
    }, 1500);
  }

  onclickLocation = () => {
    let that = this

    document.querySelector('.search').addEventListener('click', function(e) {
      for (let i = 0; i < that.state.listedMarkers.length; i++) {
        if (that.state.listedMarkers[i].title.toLowerCase() === e.target.innerText.toLowerCase()) {
          let newlocation = {
            lat: that.state.venues[i].venue.location.lat,
            lng: that.state.venues[i].venue.location.lng
          }
          // console.log("newloc", newlocation)
          that.setState({center: newlocation})
          let newMarkerCenter2 = new window.google.maps.LatLng(newlocation);
          that.state.map.setCenter(newMarkerCenter2)

          let contentStringSearch = that.state.venues[i].venue.location.address + ', \n ' + that.state.venues[i].venue.name
          that.state.info.setContent(contentStringSearch)
          that.state.info.open(that.state.map, that.state.listedMarkers[i])

          let k = e.target.style.color;
          e.target.style.color = 'aliceBlue'; // eslint-disable-next-line no-use-before-define
          setTimeout(function() {
            e.target.style.color = k;
          }, 1500);
          // console.log("cont", contentStringSearch)
          let selected = that.state.listedMarkers[i]
          selected.setAnimation(window.google.maps.Animation.BOUNCE);
          // eslint-disable-next-line no-use-before-define
          setTimeout(function() {
            selected.setAnimation(null);
          }, 1500);
        }
      }
    })
  }

  //to toggle the side bar by clicking the hamburger button
  toggleNavBar = () => {
    const navbar = document.querySelector('.side');
    const mapClass = document.querySelector('#map');

    if (navbar.style.display === 'none') {
      navbar.style.display = 'block';
    } else {
      navbar.style.display = 'none'
      mapClass.style.width = '100%'
    }
  }

  render() {
    var message = '. You are searching for  ' + this.state.querySelector + ' venues';

    // console.log("cat", this.state.querySelector)
    // console.log("venues", this.state.venues)
    return (<div className='app'>
      <header>
        <button aria-label="hide-sidebar" type="button" className="navbar-toggle collapsed" data-toggle="collapse" onClick={this.toggleNavBar}>
          <div className="icon-bar"></div>
          <div className="icon-bar"></div>
          <div className="icon-bar"></div>
        </button>

        <h3>Google Maps with&nbsp;
          <a href="https://foursquare.com/developers/apps">Foursquare</a>
        </h3>
        <h3>
          {message}</h3>

      </header>
      <div id="container">

        <div className='side'>

          <Search infoWindow={this.state.info} openInfo={this.info} listedMarker={this.state.listedMarkers}></Search>
        </div>
        <div id="map">
          <Map markers={this.state.venues.location}></Map>
        </div>
      </div>
    </div>);
  }
}

function loadMap(url) {
  let tag = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded. Please reload the page, and if that doesn't work reload the page. Otherwise reload page.");
  };
  tag.parentNode.insertBefore(script, tag);
}
export default App;
