import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {withGoogleMap, GoogleMap, Marker, Polygon} from "react-google-maps";
import {default as MarkerClusterer} from 'react-google-maps/lib/components/addons/MarkerClusterer';

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({currLat: position.coords.latitude, currLng: position.coords.longitude});
    });
  }

  handleOnClick(pushUrl) {
    this.setState({pushUrl: pushUrl});
  }

  render() {
    if (this.state && this.state.pushUrl) {
      return (<Redirect to={this.state.pushUrl} push />);
    }

    var markers = null;
    if (this.props.markers) {
      markers = this.props.markers.map((m, i) => {
        return (
          <Marker
            icon={m.icon}
            key={i}
            position={{lat: m.lat, lng: m.lng}}
            label={m.label}
            title={m.title}
            clickable={true}
            onClick={this.handleOnClick.bind(this, m.url)}/>
        );
      });
    }
    if (this.state && this.state.currLat && this.state.currLng && this.state.currLat>0 && this.state.currLng>0) {
      markers.push(<Marker
                    key={-1}
                    icon="https://maps.gstatic.com/mapfiles/markers2/measle_blue.png"
                    position={{lat: this.state.currLat, lng: this.state.currLng}}/>)
    }
    var polygons = null;
    if (this.props.polygons) {
      polygons = this.props.polygons.map((p, i) => {
        return (
          <Polygon
            key={i}
            paths={p.triangleCoords}
            options={{strokeColor: '#FF3300', strokeOpacity: '0.5', strokeWeight: '2', fillColor: '#FF3300', fillOpacity: '0.15'}}
            onClick={this.handleOnClick.bind(this, p.url)}/>
        );
      });
    }
    const GettingStartedGoogleMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={this.props.defaultZoom}
        defaultCenter={this.props.defaultCenter}
        defaultMapTypeId={google.maps.MapTypeId.TERRAIN}
      >
        <MarkerClusterer
          averageCenter={ false }
          minimumClusterSize={ 60 }
          enableRetinaIcons={ false }
          imagePath={ "https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m" }
          gridSize={ 60 }>
          {markers}
          {polygons}
        </MarkerClusterer>
      </GoogleMap>
    ));

    return (
      <section style={{height: '600px'}}>
        <GettingStartedGoogleMap
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </section>
    );
  }
}
