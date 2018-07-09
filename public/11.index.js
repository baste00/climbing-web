(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{276:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var a=0;a<t.length;a++){var l=t[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,a,l){return a&&e(t.prototype,a),l&&e(t,l),t}}(),r=a(1),n=p(r),i=a(68),s=p(a(99)),o=p(a(302)),u=p(a(301)),c=a(131),d=a(135),f=p(a(134)),h=p(a(98)),m=p(a(101));function p(e){return e&&e.__esModule?e:{default:e}}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function y(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}a(100);var E=function(e){function t(){return g(this,t),b(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return y(t,r.Component),l(t,[{key:"intersperse",value:function(e,t){return 0===e.length?[]:e.slice(1).reduce(function(e,a,l){return e.concat([t,a])},[e[0]])}},{key:"render",value:function(){var e="";if(this.props.problem.comment)if(this.props.problem.comment.length>40){var t=n.default.createElement(c.Tooltip,{id:this.props.problem.id},this.props.problem.comment);e=n.default.createElement(c.OverlayTrigger,{key:this.props.problem.id,placement:"top",overlay:t},n.default.createElement("span",null,this.props.problem.comment.substring(0,40)+"..."))}else e=this.props.problem.comment;var a=this.props.problem.fa?this.props.problem.fa.map(function(e,t){return n.default.createElement(i.Link,{key:t,to:"/user/"+e.id},e.firstname," ",e.surname)}):[];a=this.intersperse(a,", ");var l,r=this.props.problem.ticked?"success":"",s=null;if(.5===this.props.problem.stars?s=n.default.createElement(m.default,{icon:"star-half"}):1===this.props.problem.stars?s=n.default.createElement("div",{style:{whiteSpace:"nowrap"},id:2},n.default.createElement(m.default,{icon:"star"})):1.5===this.props.problem.stars?s=n.default.createElement("div",{style:{whiteSpace:"nowrap"},id:3},n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star-half"})):2===this.props.problem.stars?s=n.default.createElement("div",{style:{whiteSpace:"nowrap"},id:4},n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"})):2.5===this.props.problem.stars?s=n.default.createElement("div",{style:{whiteSpace:"nowrap"},id:5},n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star-half"})):3===this.props.problem.stars&&(s=n.default.createElement("div",{style:{whiteSpace:"nowrap"},id:6},n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"}))),s&&(s=n.default.createElement(c.OverlayTrigger,{placement:"top",overlay:n.default.createElement(c.Popover,{id:0,title:"Guidelines"},n.default.createElement(m.default,{icon:"star"})," Nice",n.default.createElement("br",null),n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"})," Very nice",n.default.createElement("br",null),n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"}),n.default.createElement(m.default,{icon:"star"})," Fantastic!")},s)),4==h.default.getRegion()){var o;switch(this.props.problem.t.id){case 2:o=n.default.createElement("img",{height:"20",src:"/jpg/bolt.jpg"});break;case 3:o=n.default.createElement("img",{height:"20",src:"/jpg/trad.jpg"});break;case 4:o=n.default.createElement("img",{height:"20",src:"/jpg/mixed.jpg"})}l=n.default.createElement("td",null,n.default.createElement(c.OverlayTrigger,{placement:"top",overlay:n.default.createElement(c.Popover,{id:this.props.problem.t.id,title:"Type"},this.props.problem.t.type+" - "+this.props.problem.t.subType)},o))}return n.default.createElement("tr",{className:r},n.default.createElement("td",null,this.props.problem.nr),n.default.createElement("td",null,n.default.createElement(i.Link,{to:"/problem/"+this.props.problem.id},this.props.problem.name)," ",1===this.props.problem.visibility&&n.default.createElement(m.default,{icon:"lock"}),2===this.props.problem.visibility&&n.default.createElement(m.default,{icon:"user-secret"})),n.default.createElement("td",null,e),l,n.default.createElement("td",null,this.props.problem.grade),n.default.createElement("td",null,a),n.default.createElement("td",null,this.props.problem.numTicks),n.default.createElement("td",null,s),n.default.createElement("td",null,this.props.problem.numImages),n.default.createElement("td",null,this.props.problem.numMovies),n.default.createElement("td",null,(this.props.problem.lat>0&&this.props.problem.lng>0||this.props.problemsInTopo.indexOf(this.props.problem.id)>=0)&&n.default.createElement(m.default,{icon:"check"})))}}]),t}(),v=function(e){function t(e){g(this,t);var a=b(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={tabIndex:1},a}return y(t,r.Component),l(t,[{key:"refresh",value:function(e){var t=this;s.default.get(h.default.getUrl("sectors?regionId="+h.default.getRegion()+"&id="+e)).withCredentials().end(function(e,a){e?t.setState({error:e}):(t.setState(a.body),document.title=h.default.getTitle(t.state.name))})}},{key:"componentDidMount",value:function(){this.refresh(this.props.match.params.sectorId)}},{key:"componentWillReceiveProps",value:function(e){this.refresh(e.match.params.sectorId)}},{key:"handleTabsSelection",value:function(e){this.setState({tabIndex:e})}},{key:"onRemoveMedia",value:function(e){var t=this.state.media.filter(function(t){return t.id!=e});this.setState({media:t})}},{key:"render",value:function(){if(!this.state.areaId)return n.default.createElement("center",null,n.default.createElement(m.default,{icon:"spinner",spin:!0,size:"3x"}));if(this.state.error)return n.default.createElement("span",null,n.default.createElement("h3",null,this.state.error.status),this.state.error.toString());var e=[];this.state.media&&this.state.media.forEach(function(t){t.svgs&&t.svgs.forEach(function(t){return e.push(t.problemId)})});var t=this.state.problems.map(function(t,a){return n.default.createElement(E,{problem:t,problemsInTopo:e,key:a})}),a=this.state.problems.filter(function(e){return 0!=e.lat&&0!=e.lng}).map(function(e){return{lat:e.lat,lng:e.lng,title:e.nr+" - "+e.name+" ["+e.grade+"]",label:e.name.charAt(0),url:"/problem/"+e.id,icon:{url:e.ticked?"https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-a.png":"https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-b.png",labelOrigin:new google.maps.Point(11,13)}}});this.state.lat>0&&this.state.lng>0&&a.push({lat:this.state.lat,lng:this.state.lng,title:"Parking",icon:{url:"https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png",scaledSize:new google.maps.Size(32,32)},url:"/sector/"+this.state.id});var l=this.state.lat&&this.state.lat>0?{lat:this.state.lat,lng:this.state.lng}:h.default.getDefaultCenter(),r=this.state.lat&&this.state.lat>0?15:h.default.getDefaultZoom(),s=a.length>0?n.default.createElement(o.default,{markers:a,defaultCenter:l,defaultZoom:r}):null,p=this.state.media&&this.state.media.length>0?n.default.createElement(u.default,{media:this.state.media,showThumbnails:this.state.media.length>1,removeMedia:this.onRemoveMedia.bind(this)}):null,g=null;s&&p?g=n.default.createElement(c.Tabs,{activeKey:this.state.tabIndex,animation:!1,onSelect:this.handleTabsSelection.bind(this),id:"sector_tab",unmountOnExit:!0},n.default.createElement(c.Tab,{eventKey:1,title:"Topo"},1==this.state.tabIndex&&p),n.default.createElement(c.Tab,{eventKey:2,title:"Map"},2==this.state.tabIndex&&s)):s?g=s:p&&(g=p);var b=this.state.problems.length>0?this.state.problems[this.state.problems.length-1].nr+1:1;return n.default.createElement("span",null,n.default.createElement(c.Breadcrumb,null,f.default.isAdmin()?n.default.createElement("div",{style:{float:"right"}},n.default.createElement(c.ButtonGroup,null,n.default.createElement(c.OverlayTrigger,{placement:"top",overlay:n.default.createElement(c.Tooltip,{id:-1},"Add problem")},n.default.createElement(d.LinkContainer,{to:{pathname:"/problem/edit/-1",query:{idSector:this.state.id,nr:b,lat:this.state.lat,lng:this.state.lng}}},n.default.createElement(c.Button,{bsStyle:"primary",bsSize:"xsmall"},n.default.createElement(m.default,{icon:"plus-square",inverse:"true"})))),n.default.createElement(c.OverlayTrigger,{placement:"top",overlay:n.default.createElement(c.Tooltip,{id:this.state.id},"Edit sector")},n.default.createElement(d.LinkContainer,{to:{pathname:"/sector/edit/"+this.state.id,query:{idArea:this.state.areaId,lat:this.state.lat,lng:this.state.lng}}},n.default.createElement(c.Button,{bsStyle:"primary",bsSize:"xsmall"},n.default.createElement(m.default,{icon:"edit",inverse:"true"})))))):null,n.default.createElement(i.Link,{to:"/"},"Home")," / ",n.default.createElement(i.Link,{to:"/browse"},"Browse")," / ",n.default.createElement(i.Link,{to:"/area/"+this.state.areaId},this.state.areaName)," ",1===this.state.areaVisibility&&n.default.createElement(m.default,{icon:"lock"}),2===this.state.areaVisibility&&n.default.createElement(m.default,{icon:"user-secret"})," / ",n.default.createElement("font",{color:"#777"},this.state.name)," ",1===this.state.visibility&&n.default.createElement(m.default,{icon:"lock"}),2===this.state.visibility&&n.default.createElement(m.default,{icon:"user-secret"})),g,this.state.comment?n.default.createElement(c.Well,null,this.state.comment):null,n.default.createElement(c.Table,{striped:!0,condensed:!0,hover:!0},n.default.createElement("thead",null,n.default.createElement("tr",null,n.default.createElement("th",null,n.default.createElement(m.default,{icon:"hashtag"})),n.default.createElement("th",null,"Name"),n.default.createElement("th",null,"Description"),4==h.default.getRegion()&&n.default.createElement("th",null,"Type"),n.default.createElement("th",null,"Grade"),n.default.createElement("th",null,"FA"),n.default.createElement("th",null,"Ticks"),n.default.createElement("th",null,"Stars"),n.default.createElement("th",null,n.default.createElement(m.default,{icon:"camera"})),n.default.createElement("th",null,n.default.createElement(m.default,{icon:"video"})),n.default.createElement("th",null,n.default.createElement(m.default,{icon:"map-marker"})))),n.default.createElement("tbody",null,t)))}}]),t}();t.default=v},301:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var a=0;a<t.length;a++){var l=t[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,a,l){return a&&e(t.prototype,a),l&&e(t,l),t}}(),r=a(1),n=b(r),i=b(a(335)),s=a(131),o=b(a(334)),u=b(a(134)),c=b(a(99)),d=a(314),f=a(68),h=b(a(98)),m=a(133),p=b(a(333)),g=b(a(101));function b(e){return e&&e.__esModule?e:{default:e}}a(100);var y=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={mediaIndex:0,hoverTrash:!1,hoverEdit:!1,showFullscreenButton:!0,showGalleryFullscreenButton:!0,showPlayButton:!0,showGalleryPlayButton:!1,showVideo:{},isFullscreen:!1},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),l(t,[{key:"componentWillReceiveProps",value:function(e){this.state={mediaIndex:0,hoverTrash:!1,hoverEdit:!1,showFullscreenButton:!0,showGalleryFullscreenButton:!0,showPlayButton:!0,showGalleryPlayButton:!1,showVideo:{},isFullscreen:!1},this.imageGallery&&this.imageGallery.slideToIndex(0)}},{key:"toggleHoverTrash",value:function(){this.setState({hoverTrash:!this.state.hoverTrash})}},{key:"toggleHoverEdit",value:function(){this.setState({hoverEdit:!this.state.hoverEdit})}},{key:"onDeleteImage",value:function(e){var t=this;if(confirm("Are you sure you want to delete this image?")){var a=this.props.media[this.state.mediaIndex].id;c.default.delete(h.default.getUrl("media?id="+a)).withCredentials().end(function(e,l){if(e)alert(e.toString());else{if(t.props.media.length>1&&t.state.mediaIndex>=t.props.media.length-1){var r=t.state.mediaIndex-1;t.setState({mediaIndex:r}),t.imageGallery.slideToIndex(r)}t.props.removeMedia(a)}})}}},{key:"onSlide",value:function(e){this.resetVideo(),this.setState({mediaIndex:e})}},{key:"onScreenChange",value:function(e){this.setState({isFullscreen:e})}},{key:"resetVideo",value:function(){this.setState({showVideo:{}}),this.state.showPlayButton&&this.setState({showGalleryPlayButton:!0}),this.state.showFullscreenButton&&this.setState({showGalleryFullscreenButton:!0})}},{key:"toggleShowVideo",value:function(e){this.state.showVideo[e]=!Boolean(this.state.showVideo[e]),this.setState({showVideo:this.state.showVideo}),this.state.showVideo[e]&&(this.state.showPlayButton&&this.setState({showGalleryPlayButton:!1}),this.state.showFullscreenButton&&this.setState({showGalleryFullscreenButton:!1}))}},{key:"renderVideo",value:function(e){var t=this;return n.default.createElement("div",{className:"image-gallery-image"},this.state.showVideo[e.embedUrl]?n.default.createElement("span",null,n.default.createElement("a",{className:"gallery-close-video",onClick:this.toggleShowVideo.bind(this,e.embedUrl)}),n.default.createElement(o.default,{ref:function(e){t.player=e},className:"react-player",width:"100%",height:"100%",url:e.embedUrl,onDuration:function(e){return t.setState({duration:e})},onStart:function(){return t.player.seekTo(parseFloat(e.seekTo/t.state.duration))},controls:!0,playing:!0})):n.default.createElement("a",{onClick:this.toggleShowVideo.bind(this,e.embedUrl)},n.default.createElement("div",{className:"gallery-play-button"}),n.default.createElement("img",{src:e.original})))}},{key:"pushUrl",value:function(e){this.setState({pushUrl:e})}},{key:"generateShapes",value:function(e,t,a,l){var r=this;return e.map(function(e,i){var s,o=(0,d.parseSVG)(e.path);(0,d.makeAbsolute)(o);for(var u,c=0,f=99999999,h=0,m=o.length;h<m;h++)o[h].y>c&&(s=h,c=o[h].y),o[h].y<f&&(u=h,f=o[h].y);var p=o[s].x,g=o[s].y,b=.012*a;p<b&&(p=b),p>a-b&&(p=a-b),g<b&&(g=b),g>l-b&&(g=l-b);var y=null;return e.hasAnchor&&(y=n.default.createElement("circle",{className:"buldreinfo-svg-ring",cx:o[u].x,cy:o[u].y,r:.006*a})),n.default.createElement("g",{className:"buldreinfo-svg-pointer buldreinfo-svg-hover"+(0===t||e.problemId===t?"":" buldreinfo-svg-opacity"),key:i,onClick:r.pushUrl.bind(r,"/problem/"+e.problemId)},n.default.createElement("path",{d:e.path,className:"buldreinfo-svg-route",strokeWidth:.003*a,strokeDasharray:.006*a}),n.default.createElement("circle",{className:"buldreinfo-svg-ring",cx:p,cy:g,r:b}),n.default.createElement("text",{className:"buldreinfo-svg-routenr",x:p,y:g,fontSize:.02*a,dy:".3em"},e.nr),y)})}},{key:"renderImage",value:function(e){return e.svgs?n.default.createElement("div",{className:"image-gallery-image"},n.default.createElement("canvas",{className:"buldreinfo-svg-canvas-ie-hack",width:e.width,height:e.height}),n.default.createElement("svg",{className:"buldreinfo-svg",viewBox:"0 0 "+e.width+" "+e.height,preserveAspectRatio:"xMidYMid meet"},n.default.createElement("image",{xlinkHref:h.default.getUrl("images?id="+e.id),width:"100%",height:"100%"}),this.generateShapes(e.svgs,e.svgProblemId,e.width,e.height))):n.default.createElement("div",{className:"image-gallery-image"},n.default.createElement("img",{src:h.default.getUrl("images?id="+e.id),className:"buldreinfo-scale-img"}))}},{key:"render",value:function(){var e=this;if((0,p.default)(null,{watchMQ:!0}),this.state&&this.state.pushUrl)return n.default.createElement(m.Redirect,{to:this.state.pushUrl,push:!0});var t=this.props.media.map(function(t,a){return 1==t.idType?{original:h.default.getUrl("images?id="+t.id),thumbnail:h.default.getUrl("images?id="+t.id),originalClass:"featured-slide",thumbnailClass:"featured-thumb",originalAlt:"original-alt",thumbnailAlt:"thumbnail-alt",renderItem:e.renderImage.bind(e,t)}:{original:h.default.getUrl("images?id="+t.id),thumbnail:h.default.getUrl("images?id="+t.id),originalClass:"featured-slide",thumbnailClass:"featured-thumb",originalAlt:"original-alt",thumbnailAlt:"thumbnail-alt",embedUrl:"https://buldreinfo.com/buldreinfo_media/mp4/"+100*Math.floor(t.id/100)+"/"+t.id+".mp4",seekTo:t.t,renderItem:e.renderVideo.bind(e)}}),a="",l=this.props.media[this.state.mediaIndex];return!this.state.isFullscreen&&1==l.idType&&u.default.isAdmin()&&(l.svgProblemId>0?a=n.default.createElement("span",{style:{position:"absolute",zIndex:"4",background:"rgba(0, 0, 0, 0.4)",padding:"8px 20px"}},n.default.createElement(f.Link,{to:"/problem/svg-edit/"+l.svgProblemId+"/"+l.id,onMouseEnter:this.toggleHoverEdit.bind(this),onMouseLeave:this.toggleHoverEdit.bind(this)},n.default.createElement(g.default,{icon:"edit",style:this.state.hoverEdit?{transform:"scale(1.1)",color:"#fff"}:{color:"#fff"}}))):l.svgs||(a=n.default.createElement("span",{style:{position:"absolute",zIndex:"4",background:"rgba(0, 0, 0, 0.4)",padding:"8px 20px"}},n.default.createElement("a",{href:"#",onMouseEnter:this.toggleHoverTrash.bind(this),onMouseLeave:this.toggleHoverTrash.bind(this)},n.default.createElement(g.default,{icon:"trash",style:this.state.hoverTrash?{transform:"scale(1.1)",color:"#fff"}:{color:"#fff"},onClick:this.onDeleteImage.bind(this)}))))),n.default.createElement(s.Well,{className:"app"},a,n.default.createElement(i.default,{ref:function(t){return e.imageGallery=t},items:t,onSlide:this.onSlide.bind(this),onScreenChange:this.onScreenChange.bind(this),showThumbnails:this.props.showThumbnails,showBullets:this.state.showFullscreenButton&&this.state.showGalleryFullscreenButton&&this.props.media.length>1,showIndex:this.state.showFullscreenButton&&this.state.showGalleryFullscreenButton,showPlayButton:!1,showFullscreenButton:this.state.showFullscreenButton&&this.state.showGalleryFullscreenButton}))}}]),t}();t.default=y},302:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var a=0;a<t.length;a++){var l=t[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,a,l){return a&&e(t.prototype,a),l&&e(t,l),t}}(),r=a(1),n=u(r),i=a(133),s=a(303),o=u(a(336));function u(e){return e&&e.__esModule?e:{default:e}}var c=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return navigator.geolocation.getCurrentPosition(function(e){a.setState({currLat:e.coords.latitude,currLng:e.coords.longitude})}),a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),l(t,[{key:"handleOnClick",value:function(e){this.setState({pushUrl:e})}},{key:"render",value:function(){var e=this;if(this.state&&this.state.pushUrl)return n.default.createElement(i.Redirect,{to:this.state.pushUrl,push:!0});var t=null;this.props.markers&&(t=this.props.markers.map(function(t,a){return n.default.createElement(s.Marker,{icon:t.icon,key:a,position:{lat:t.lat,lng:t.lng},label:t.label,title:t.title,clickable:!0,onClick:e.handleOnClick.bind(e,t.url)})})),this.state&&this.state.currLat&&this.state.currLng&&this.state.currLat>0&&this.state.currLng>0&&t.push(n.default.createElement(s.Marker,{key:-1,icon:"https://maps.gstatic.com/mapfiles/markers2/measle_blue.png",position:{lat:this.state.currLat,lng:this.state.currLng}}));var a=null;this.props.polygons&&(a=this.props.polygons.map(function(t,a){return n.default.createElement(s.Polygon,{key:a,paths:t.triangleCoords,options:{strokeColor:"#FF3300",strokeOpacity:"0.5",strokeWeight:"2",fillColor:"#FF3300",fillOpacity:"0.15"},onClick:e.handleOnClick.bind(e,t.url)})}));var l=(0,s.withGoogleMap)(function(l){return n.default.createElement(s.GoogleMap,{defaultZoom:e.props.defaultZoom,defaultCenter:e.props.defaultCenter,defaultMapTypeId:google.maps.MapTypeId.TERRAIN},n.default.createElement(o.default,{averageCenter:!1,minimumClusterSize:60,enableRetinaIcons:!1,imagePath:"https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m",gridSize:60},t,a))});return n.default.createElement("section",{style:{height:"600px"}},n.default.createElement(l,{containerElement:n.default.createElement("div",{style:{height:"100%"}}),mapElement:n.default.createElement("div",{style:{height:"100%"}})}))}}]),t}();t.default=c}}]);
//# sourceMappingURL=11.index.js.map