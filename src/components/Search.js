import React, {Component} from 'react';

class Search extends Component {

  constructor() {
    super();

    this.state = {
        info: '',
        markers: [],
        query: ''
    };
    this.refreshList = this.refreshList.bind(this)
  }

  componentDidMount() {
    // this.setState({this.state.markers)
    this.refreshList()
  }

  refreshList(){
  // this.setState({markers: []});
    this.setState({markers: this.props.listedMarker});
  }

  searchVenue = (event) => {
    const query = event.target.value.toLowerCase();
    const markers = this.props.listedMarker;
    const newMarkers = [];

    markers.forEach(function (marker) {
      if (marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        marker.setVisible(true);
        newMarkers.push(marker);
      } else {
        marker.setVisible(false);
      }
    });

    this.setState({markers: newMarkers});
  }


  openMarker(marker) {
    // console.log(marker);
    this.props.openInfo(marker);
  }

  render() {

  return (
    <div className="app">
      <div className="search">
        <div className="form" role="form">
          <label htmlFor="search">Search:</label>
          <input id="search" type="text"
            aria-label="search" placeholder="Search..."
            className="input" role="search"
            onChange={this.searchVenue}/>
            <label htmlFor="search"></label>
        </div>
        <ul>
          {
          this.state.markers &&
          this.state.markers.length &&
          this.state.markers.map((marker, i) =>
            <li
              key={i}>
              <a href={this.props.infowindow} onKeyPress={this.props.infowindow}
                onClick={this.props.infowindow}
                tabIndex="0" role="button">{marker.title}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
    );
  }
}

export default Search;
