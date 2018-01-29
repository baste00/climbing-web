import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Request from 'superagent';
import { OverlayTrigger, Tooltip, Button, Table, Breadcrumb } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { LinkContainer } from 'react-router-bootstrap';
import Map from './common/map/map';
import auth from '../utils/auth.js';
import config from '../utils/config.js';

export default class Browse extends Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({currLat: position.coords.latitude, currLng: position.coords.longitude});
    });
    Request.get(config.getUrl("areas/list?regionId=" + config.getRegion())).withCredentials().end((err, res) => {
      this.setState({
        error: err? err : null,
        areas: err? null : res.body
      });
      document.title=config.getTitle() + " | browse";
    });
  }

  formatName(cell, row) {
    return <span><Link to={`/area/${row.id}`}>{row.name}</Link> {row.visibility===1 && <i className="fa fa-lock"></i>}{row.visibility===2 && <i className="fa fa-expeditedssl"></i>}</span>;
  }

  formatDescription(cell, row) {
    var comment = "";
    if (row.comment) {
      if (row.comment.length>100) {
        const tooltip = (<Tooltip id={row.id}>{row.comment}</Tooltip>);
        comment = <OverlayTrigger key={row.id} placement="top" overlay={tooltip}><span>{row.comment.substring(0,100) + "..."}</span></OverlayTrigger>;
      } else {
        comment = row.comment;
      }
    }
    return comment;
  }

  formatNumSectors(cell, row) {
    return row.numSectors;
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  }

  formatDistance(cell, row) {
    if (this.state.currLat>0 && this.state.currLng>0 && row.lat>0 && row.lng>0) {
      return this.calcCrow(this.state.currLat, this.state.currLng, row.lat, row.lng).toFixed(1) + " km";
    }
    return "";
  }

  sortDistance(a, b, order) {
    const x = this.state.currLat>0 && this.state.currLng>0 && a.lat>0 && a.lng>0? this.calcCrow(this.state.currLat, this.state.currLng, a.lat, a.lng) : 0;
    const y = this.state.currLat>0 && this.state.currLng>0 && b.lat>0 && b.lng>0? this.calcCrow(this.state.currLat, this.state.currLng, b.lat, b.lng) : 0;
    if (order==='asc') {
      if (x<y) return -1;
      else if (x>y) return 1;
      return 0;
    } else {
      if (x<y) return 1;
      else if (x>y) return -1;
      return 0;
    }
  }

  render() {
    if (!this.state || !this.state.areas) {
      return <center><i className="fa fa-cog fa-spin fa-2x"></i></center>;
    }
    if (this.state.error) {
      return <span><h3>{this.state.error.status}</h3>{this.state.error.toString()}</span>;
    }
    const markers = this.state.areas.filter(a => a.lat!=0 && a.lng!=0).map(a => {
      return {
          lat: a.lat,
          lng: a.lng,
          title: a.name,
          label: a.name.charAt(0),
          url: '/area/' + a.id
        }
    });
    const map = markers.length>0? <Map markers={markers} defaultCenter={config.getDefaultCenter()} defaultZoom={config.getDefaultZoom()}/> : null;
    return (
      <span>
        <Breadcrumb>
          {auth.isAdmin()?
            <OverlayTrigger placement="top" overlay={<Tooltip id={-1}>Add area</Tooltip>}>
              <div style={{float: 'right'}}><LinkContainer to={`/area/edit/-1`}><Button bsStyle="primary" bsSize="xsmall"><i className="fa fa-inverse fa-plus-square"/></Button></LinkContainer></div>
            </OverlayTrigger>:
            null
          }
          <Link to={`/`}>Home</Link> / <font color='#777'>Browse</font>
        </Breadcrumb>
        {map}
        <BootstrapTable
          data={this.state.areas}
          condensed={true}
          hover={true}
          columnFilter={false}>
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>id</TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort={true} dataFormat={this.formatName.bind(this)} width="150" filter={{type: "TextFilter", placeholder: "Filter"}}>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="description" dataFormat={this.formatDescription.bind(this)} width="150">Description</TableHeaderColumn>
          <TableHeaderColumn dataField="numSectors" dataSort={true} dataFormat={this.formatNumSectors.bind(this)} dataAlign="center" width="50">#sectors</TableHeaderColumn>
          <TableHeaderColumn dataField="distance" dataSort={true} dataFormat={this.formatDistance.bind(this)} sortFunc={this.sortDistance.bind(this)} dataAlign="center" width="60"><i className="fa fa-plane"></i></TableHeaderColumn>
        </BootstrapTable>
      </span>
    );
  }
}
