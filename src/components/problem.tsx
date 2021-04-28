import React, { useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { Link, useParams, useHistory } from 'react-router-dom';
import Leaflet from './common/leaflet/leaflet';
import { calculateDistance } from './common/leaflet/distance-math';
import Media from './common/media/media';
import { Button, Grid, Breadcrumb, Tab, Label, Icon, Comment, Header, Segment, Table, Feed } from 'semantic-ui-react';
import { LoadingAndRestoreScroll, LockSymbol, Stars } from './common/widgets/widgets';
import { useAuth0 } from '../utils/react-auth0-spa';
import { getAreaPdfUrl, getSectorPdfUrl, getProblemPdfUrl, getProblem, postComment, postTodo } from '../api';
import TickModal from './common/tick-modal/tick-modal';
import CommentModal from './common/comment-modal/comment-modal';
import Linkify from 'react-linkify';

interface ProblemIdParams {
  problemId: string;
}
const Problem = () => {
  const { loading, accessToken } = useAuth0();
  const [data, setData] = useState(null);
  const [showTickModal, setShowTickModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showHiddenMedia, setShowHiddenMedia] = useState(false);
  const [reload, setReload] = useState(true);
  let { problemId } = useParams<ProblemIdParams>();
  let history = useHistory();

  useEffect(() => {
    if (!loading && (reload || (data != null && data.id!=problemId))) {
      getProblem(accessToken, parseInt(problemId), showHiddenMedia).then((data) => {
        setData(data);
        setReload(false);
      });
    }
  }, [loading, accessToken, problemId, reload]);

  function onRemoveMedia(idMediaToRemove) {
    let newMedia = data.media.filter(m => m.id!=idMediaToRemove);
    setData(prevState => ({ ...prevState, media: newMedia }));
  }

  function flagAsDangerous(id) {
    if (confirm('Are you sure you want to flag this comment?')) {
      setData(null);
      postComment(accessToken, id, -1, null, true, false)
        .then((response) => {
          setReload(true);
        })
        .catch((error) => {
          console.warn(error);
          alert(error.toString());
        });
    }
  }

  function toggleTodo(problemId : number) {
    setData(null);
    postTodo(accessToken, problemId)
    .then((response) => {
      setReload(true);
    })
    .catch((error) => {
      console.warn(error);
      alert(error.toString());
    });
  }

  function closeTickModal() {
    setShowTickModal(false);
    setReload(true);
  }

  function openTickModal() {
    setShowTickModal(true);
  }

  function closeCommentModal() {
    setShowCommentModal(false);
    setReload(true);
  }

  function openCommentModal() {
    setShowCommentModal(true);
  }

  if (!data || reload) {
    return <LoadingAndRestoreScroll />;
  }
  const markers = [];
  if (data.lat>0 && data.lng>0) {
    markers.push({
      lat: data.lat,
      lng: data.lng,
      label: data.name + ' [' + data.grade + ']',
      url: '/problem/' + data.id
    });
  }
  if (data.sectorLat>0 && data.sectorLng>0) {
    markers.push({
      lat: data.sectorLat,
      lng: data.sectorLng,
      url: '/sector/' + data.sectorId,
      isParking: true
    });
  }
  const panes = [];
  if (data.media && data.media.length>0) {
    panes.push({
      menuItem: { key: 'media', icon: 'images', content: 'Media' },
      render: () =>
        <Tab.Pane>
          <Media isAdmin={data.metadata.isAdmin}
            removeMedia={onRemoveMedia}
            media={data.media}
            optProblemId={data.id} />
        </Tab.Pane>
    });
  }
  if (markers.length>0) {
    const polyline = data.sectorPolyline && data.sectorPolyline.split(";").map(e => e.split(",").map(Number));
    var outlines;
    if (data.sectorPolygonCoords) {
      const polygon = data.sectorPolygonCoords.split(";").map(c => {
        const latLng = c.split(",");
        return ([parseFloat(latLng[0]), parseFloat(latLng[1])]);
      });
      let label = data.sectorName + (polyline? " (" + calculateDistance(polyline) + ")" : "");
      outlines = [{url: '/sector/' + data.sectorId, label, polygon}];
    }
    panes.push({
      menuItem: { key: 'map', icon: 'map', content: 'Map' },
      render: () => <Tab.Pane><Leaflet key={"sector="+data.id} autoZoom={true} height='40vh' markers={markers} outlines={outlines} polylines={polyline && [polyline]} defaultCenter={{lat: markers[0].lat, lng: markers[0].lng}} defaultZoom={16} history={history} onClick={null} clusterMarkers={false} /></Tab.Pane>
    });
  }
  
  const ticks = (
    <Comment.Group as={Segment}>
      <Header as="h3" dividing>Ticks:</Header>
      {data.ticks?
        data.ticks.map((t, i) => (
          <Comment key={i}>
            <Comment.Avatar src={t.picture? t.picture : '/png/image.png'} />
            <Comment.Content>
              <Comment.Author as={Link} to={`/user/${t.idUser}`}>{t.name}</Comment.Author>
              <Comment.Metadata>{t.date}</Comment.Metadata>
              <Comment.Text><Stars numStars={t.stars} /> {t.suggestedGrade}<br/><Linkify>{t.comment}</Linkify></Comment.Text>
            </Comment.Content>
          </Comment>
        ))
      :
        <i>No ticks</i>
      }
    </Comment.Group>
  );
  const comments = (
    <Comment.Group as={Segment}>
      <Header as="h3" dividing>Comments:</Header>
      {data.comments?
        data.comments.map((c, i) => {
          var extra = null;
          if (c.danger) {
            extra = <Label color="red">Flagged as dangerous</Label>;
          } else if (c.resolved) {
            extra = <Label color="green">Flagged as safe</Label>;
          } else if (data.metadata && data.metadata.isAuthenticated && data.metadata.gradeSystem==='CLIMBING') {
            extra = <Button basic size="tiny" compact onClick={() => flagAsDangerous(c.id)}>Flag as dangerous</Button>;
          }
          return (
            <Comment key={i}>
              <Comment.Avatar src={c.picture? c.picture : '/png/image.png'} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/user/${c.idUser}`}>{c.name}</Comment.Author>
                <Comment.Metadata>{c.date}</Comment.Metadata>
                <Comment.Text><Linkify>{c.message}</Linkify></Comment.Text>
                {extra && <Comment.Actions>{extra}</Comment.Actions>}
              </Comment.Content>
            </Comment>
        )})
      :
        <i>No comments</i>
      }
    </Comment.Group>
  );
  
  var tickModal = null;
  if (showTickModal) {
    if (data.ticks) {
      const userTicks = data.ticks.filter(t => t.writable);
      if (userTicks && userTicks.length>0) {
        tickModal = <TickModal accessToken={accessToken} idTick={userTicks[0].id} idProblem={data.id} date={userTicks[0].date} comment={userTicks[0].comment} grade={userTicks[0].suggestedGrade} grades={data.metadata.grades} stars={userTicks[0].stars} open={showTickModal} onClose={closeTickModal}/>
      }
    }
    if (!tickModal) {
      tickModal = <TickModal accessToken={accessToken} idTick={-1} idProblem={data.id} grade={data.originalGrade} grades={data.metadata.grades} open={showTickModal} onClose={closeTickModal} comment={null} stars={null} date={null} />;
    }
  }
  return (
    <>
      <MetaTags>
        {data.metadata.canonical && <link rel="canonical" href={data.metadata.canonical} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data.metadata.jsonLd)}} />
        <title>{data.metadata.title}</title>
        <meta name="description" content={data.metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={data.metadata.description} />
        <meta property="og:url" content={data.metadata.og.url} />
        <meta property="og:title" content={data.metadata.title} />
        <meta property="og:image" content={data.metadata.og.image} />
        <meta property="og:image:width" content={data.metadata.og.imageWidth} />
        <meta property="og:image:height" content={data.metadata.og.imageHeight} />
        <meta property="fb:app_id" content={data.metadata.og.fbAppId} />
      </MetaTags>
      {tickModal}
      <CommentModal accessToken={accessToken} idProblem={data.id} open={showCommentModal} onClose={closeCommentModal} showHse={data.metadata.gradeSystem==='CLIMBING'}/>
      <div style={{marginBottom: '5px'}}>
        <div style={{float: 'right'}}>
          {data.metadata && data.metadata.isAuthenticated &&
            <Button.Group size="mini" compact>
              <Button positive={data.todo} animated='fade' onClick={() => toggleTodo(data.id)}>
                <Button.Content hidden>To-do</Button.Content>
                <Button.Content visible>
                  <Icon name='bookmark' />
                </Button.Content>
              </Button>
              <Button positive={data.ticks && data.ticks.filter(t => t.writable).length>0} animated='fade' onClick={openTickModal}>
                <Button.Content hidden>Tick</Button.Content>
                <Button.Content visible>
                  <Icon name='check' />
                </Button.Content>
              </Button>
              <Button animated='fade' onClick={openCommentModal}>
                <Button.Content hidden>Comment</Button.Content>
                <Button.Content visible>
                  <Icon name='comment' />
                </Button.Content>
              </Button>
              {data.metadata.isAdmin &&
                <Button positive={showHiddenMedia} animated='fade' onClick={() => {
                  setShowHiddenMedia(!showHiddenMedia);
                  setReload(true);
                }}>
                  <Button.Content hidden>Images</Button.Content>
                  <Button.Content visible>
                    <Icon name='eye' />
                  </Button.Content>
                </Button>
              }
              {data.metadata.isAdmin?
                <Button animated='fade' as={Link} to={`/problem/edit/${data.sectorId}-${data.id}`}>
                  <Button.Content hidden>Edit</Button.Content>
                  <Button.Content visible>
                    <Icon name='edit' />
                  </Button.Content>
                </Button>
              :
                <Button animated='fade' as={Link} to={`/problem/edit/media/${data.id}`}>
                  <Button.Content hidden>Image</Button.Content>
                  <Button.Content visible>
                    <Icon name='edit' />
                  </Button.Content>
                </Button>
              }
            </Button.Group>
          }
        </div>
        <Breadcrumb>
          <Breadcrumb.Section><Link to='/browse'>Browse</Link></Breadcrumb.Section>
          <Breadcrumb.Divider icon='right angle' />
          <Breadcrumb.Section><Link to={`/area/${data.areaId}`}>{data.areaName}</Link> <LockSymbol lockedAdmin={data.areaLockedAdmin} lockedSuperadmin={data.areaLockedSuperadmin} /></Breadcrumb.Section>
          <Breadcrumb.Divider icon='right angle' />
          <Breadcrumb.Section><Link to={`/sector/${data.sectorId}`}>{data.sectorName}</Link> <LockSymbol lockedAdmin={data.sectorLockedAdmin} lockedSuperadmin={data.sectorLockedSuperadmin} /></Breadcrumb.Section>
          <Breadcrumb.Divider icon='right angle' />
          <Breadcrumb.Section active>{data.name} {data.grade} <LockSymbol lockedAdmin={data.lockedAdmin} lockedSuperadmin={data.lockedSuperadmin} /></Breadcrumb.Section>
        </Breadcrumb>
      </div>
      <Tab panes={panes} />
      <Table definition unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3}>Number:</Table.Cell>
            <Table.Cell>{data.nr}</Table.Cell>
          </Table.Row>
          {data.sectorIdProblemPrev>0 && (
            <Table.Row>
              <Table.Cell>Jump:</Table.Cell>
              <Table.Cell>
              <Button.Group size="mini">
                <Button size="tiny" as={Link} to={`/problem/${data.sectorIdProblemPrev}`} icon labelPosition='left'>
                  <Icon name='angle left' />
                  Prev
                </Button>
                <Button size="tiny" as={Link} to={`/problem/${data.sectorIdProblemNext}`} icon labelPosition='right'>
                  <Icon name='angle right' />
                  Next
                </Button>
              </Button.Group>
              </Table.Cell>
            </Table.Row>
          )}
          {data.faAid &&
            <Table.Row>
              <Table.Cell>First ascent (Aid):</Table.Cell>
              <Table.Cell>
                {data.faAid.dateHr && <Label basic><Icon name='calendar check' />{data.faAid.dateHr}</Label>}
                {data.faAid.users && <>{data.faAid.users.map((u, i) => (
                  <Label key={i} as={Link} to={`/user/${u.id}`} image basic>
                    {u.picture ? <img src={u.picture} /> : <Icon name="user"/>}{u.name}
                  </Label>
                ))}</>}
                {data.faAid.description && <Linkify><br/>{data.faAid.description}</Linkify>}
              </Table.Cell>
            </Table.Row>
          }
          <Table.Row>
            <Table.Cell>{data.faAid ? "First free ascent (FFA):" : "First ascent:"}</Table.Cell>
            <Table.Cell>
              <Label basic>Grade:<Label.Detail>{data.originalGrade}</Label.Detail></Label>
              {data.metadata.gradeSystem==='CLIMBING' && <Label basic><Icon name='tag' />{data.t.subType}</Label>}
              {data.faDateHr && <Label basic><Icon name='calendar check' />{data.faDateHr}</Label>}
              {data.fa && <>{data.fa.map((u, i) => (
                <Label key={i} as={Link} to={`/user/${u.id}`} image basic>
                  {u.picture ? <img src={u.picture} /> : <Icon name="user"/>}{u.name}
                </Label>
              ))}</>}
              {data.comment && data.comment.trim().length>0 && <Linkify><br/>{data.comment}</Linkify>}
            </Table.Cell>
          </Table.Row>
          {data.ticks &&
            <Table.Row>
              <Table.Cell>Public ascents:</Table.Cell>
              <Table.Cell>{data.ticks.length}</Table.Cell>
            </Table.Row>
          }
          <Table.Row>
            <Table.Cell>Download PDF:</Table.Cell>
            <Table.Cell>
              <Label href={getProblemPdfUrl(accessToken, data.id)} rel="noreferrer noopener" target="_blank" image basic>
                <Icon name="file pdf outline"/>{data.metadata.gradeSystem==='BOULDER'? "boulder.pdf" : "route.pdf"}
              </Label>
              <Label href={getSectorPdfUrl(accessToken, data.sectorId)} rel="noreferrer noopener" target="_blank" image basic>
                <Icon name="file pdf outline"/>sector.pdf
              </Label>
              <Label href={getAreaPdfUrl(accessToken, data.areaId)} rel="noreferrer noopener" target="_blank" image basic>
                <Icon name="file pdf outline"/>area.pdf
              </Label>
            </Table.Cell>
          </Table.Row>
          {data.sectorLat>0 && data.sectorLng>0 &&
            <Table.Row>
              <Table.Cell>Navigate to parking:</Table.Cell>
              <Table.Cell>
                <Label href={`https://maps.google.com/maps?q=loc:${data.sectorLat},${data.sectorLng}&navigate=yes`} rel="noopener" target="_blank" image basic >
                  <Icon name="map"/>Google Maps
                </Label>
              </Table.Cell>
            </Table.Row>
          }
          {((data.lat>0 && data.lng>0) || (data.sectorLat>0 && data.sectorLng>0)) &&
            <Table.Row>
              <Table.Cell>Forecast and web camera:</Table.Cell>
              <Table.Cell>
                <Label href={`/weather/` + JSON.stringify({lat: data.lat>0? data.lat : data.sectorLat, lng: data.lng>0? data.lng : data.sectorLng, label: data.areaName})} rel="noopener" target="_blank" image basic >
                  <Icon name="sun"/>Weather map
                </Label>
              </Table.Cell>
            </Table.Row>
          }
          <Table.Row>
            <Table.Cell>Page views:</Table.Cell>
            <Table.Cell>{data.hits}</Table.Cell>
          </Table.Row>
          {data.sections &&
            <Table.Row>
              <Table.Cell verticalAlign="top">Pitches:</Table.Cell>
              <Table.Cell>
                <Feed size="small">
                  {data.sections.map((s, i) => (
                    <Feed.Event key={i}>
                      <Feed.Label style={{marginTop: '8px'}}>{s.nr}</Feed.Label>
                      <Feed.Content>
                        <Feed.Summary>
                          <Feed.Label>{s.grade}</Feed.Label> 
                          <Feed.Date>{s.description}</Feed.Date>
                          {s.media && <Feed.Extra><Media isAdmin={data.metadata.isAdmin} removeMedia={() => window.location.reload()} media={s.media} optProblemId={null} /></Feed.Extra>}
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                  ))}
                </Feed>  
              </Table.Cell>
            </Table.Row>
          }
        </Table.Body>
      </Table>
      <Grid>
        <Grid.Column mobile={16} tablet={8} computer={8}>{ticks}</Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}>{comments}</Grid.Column>
      </Grid>
    </>
  );
}

export default Problem;
