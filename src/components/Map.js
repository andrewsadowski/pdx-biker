import React, { createRef, Component } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Legend from './Legend';
import './Map.css';

export default class CurrentLocLeafletMap extends Component {
  state = {
    hasLocation: false,
    latlng: {
      lat: 45.5127,
      lng: -122.679565
    },
    geoJSON: null
  };

  mapRef = createRef();

  componentDidMount() {
    this.mapRef.current.leafletElement.locate({
      setView: true
    });
    axios
      .get(
        'https://opendata.arcgis.com/datasets/40151125cedd49f09d211b48bb33f081_183.geojson'
      )
      .then(data => {
        const geoJSONData = data.data;
        this.setState({ geoJSON: geoJSONData });
        return L.geoJSON(this.state.geoJSON).addTo(
          this.mapRef.current.leafletElement
        );
      });
  }

  handleClick = () => {
    this.mapRef.current.leafletElement.locate();
  };

  handleLocationFound = e => {
    console.log(e);
    this.setState({
      hasLocation: true,
      latlng: e.latlng
    });
  };

  getGeoJsonStyle = (feature, layer) => {
    return {
      color: '#006400',
      weight: 10,
      opacity: 0.65
    };
  };

  render() {
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.latlng}>
        <Popup>
          <span>You are here</span>
        </Popup>
      </Marker>
    ) : null;

    return (
      <Map
        className="map-element"
        center={this.state.latlng}
        length={4}
        onClick={this.handleClick}
        setView={true}
        onLocationfound={this.handleLocationFound}
        ref={this.mapRef}
        zoom={14}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker}
        <Legend>
          <ul>
            <li>BikeStreet</li>
          </ul>
        </Legend>
      </Map>
    );
  }
}

/**
 * TODO:  Add Header + Legend to map
 *        - Header to be styled
 *        - Legend to be present in header
 *
 */