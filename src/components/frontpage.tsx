import React, { useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { Label, Grid, Statistic, Icon, Image, Card, Segment, Placeholder } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../utils/react-auth0-spa';
import { getFrontpage, getImageUrl, numberWithCommas } from '../api';
import Activity from './common/activity/activity';

const Frontpage = () => {
  const { loading, accessToken } = useAuth0();
  const [frontpage, setFrontpage] = useState(null);

  useEffect(() => {
    if (!loading) {
      getFrontpage(accessToken).then((res) => {
        setFrontpage(res);
      });
    }
  }, [loading, accessToken]);

  return (
    <>
      {frontpage &&
        <MetaTags>
          <title>{frontpage.metadata.title}</title>
          <meta name="description" content={frontpage.metadata.description} />
          <meta property="og:type" content="website" />
          <meta property="og:description" content={frontpage.metadata.description} />
          <meta property="og:url" content={frontpage.metadata.og.url} />
          <meta property="og:title" content={frontpage.metadata.title} />
          <meta property="og:image" content={frontpage.metadata.og.image} />
          <meta property="og:image:width" content={frontpage.metadata.og.imageWidth} />
          <meta property="og:image:height" content={frontpage.metadata.og.imageHeight} />
          <meta property="fb:app_id" content={frontpage.metadata.og.fbAppId} />
        </MetaTags>
      }
      <Grid>
        <Grid.Row>
          {frontpage?
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Statistic.Group size="mini" horizontal as={Segment}>
                <Statistic as={Link} to="/toc" color="blue">
                  <Statistic.Value><Icon name='list' /> {numberWithCommas(frontpage.numProblems)}</Statistic.Value>
                  <Statistic.Label>{frontpage.metadata.isBouldering? "Problems" : "Routes"}</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value><Icon name='map marker' /> {numberWithCommas(frontpage.numProblemsWithCoordinates)}</Statistic.Value>
                  <Statistic.Label>With coordinates</Statistic.Label>
                </Statistic>
                {!frontpage.metadata.isBouldering &&
                  <Statistic>
                    <Statistic.Value><Icon name='image outline' /> {numberWithCommas(frontpage.numProblemsWithTopo)}</Statistic.Value>
                    <Statistic.Label>With topo</Statistic.Label>
                  </Statistic>
                }
                <Statistic as={Link} to="/ticks/1" color="blue">
                  <Statistic.Value><Icon name='check' /> {numberWithCommas(frontpage.numTicks)}</Statistic.Value>
                  <Statistic.Label>Public ascents</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value><Icon name='image' /> {numberWithCommas(frontpage.numImages)}</Statistic.Value>
                  <Statistic.Label>Images</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value><Icon name='film' /> {numberWithCommas(frontpage.numMovies)}</Statistic.Value>
                  <Statistic.Label>Ascents on video</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              {frontpage.randomMedia &&
                <>
                  <Card>
                    <Link to={`/problem/${frontpage.randomMedia.idProblem}`}>
                      <Image size="medium" style={{maxHeight: '250px', objectFit: 'cover'}} src={getImageUrl(frontpage.randomMedia.idMedia, 275)} />
                    </Link>
                    <Card.Content>
                      <Card.Header as={Link} to={`/problem/${frontpage.randomMedia.idProblem}`}>
                        {frontpage.randomMedia.problem} {frontpage.randomMedia.grade}
                      </Card.Header>
                      <Card.Description>
                        <Link to={`/area/${frontpage.randomMedia.idArea}`}>{frontpage.randomMedia.area}</Link> / <Link to={`/sector/${frontpage.randomMedia.idSector}`}>{frontpage.randomMedia.sector}</Link>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Label.Group size="mini">
                        {frontpage.randomMedia.tagged && frontpage.randomMedia.tagged.map((x, i) => (<Label basic key={i} as={Link} to={`/user/${x.id}`}><Icon name="user"/>{x.name}</Label>))}
                        {frontpage.randomMedia.photographer && <Label basic as={Link} to={`/user/${frontpage.randomMedia.photographer.id}`}><Icon name="photo"/>{frontpage.randomMedia.photographer.name}</Label>}
                      </Label.Group>
                    </Card.Content>
                  </Card><br/>
                </>
              }
            </Grid.Column>
          :
            <Grid.Column mobile={16} tablet={8} computer={4} style={{marginBottom: '10px'}}>
              <Segment>
                <Placeholder>
                  <Placeholder.Header image><Placeholder.Line/></Placeholder.Header>
                  <Placeholder.Header image><Placeholder.Line/></Placeholder.Header>
                  <Placeholder.Header image><Placeholder.Line/></Placeholder.Header>
                  <Placeholder.Header image><Placeholder.Line/></Placeholder.Header>
                  <Placeholder.Header image><Placeholder.Line/></Placeholder.Header>
                </Placeholder>
              </Segment>
              <Card>
                <Placeholder>
                  <Placeholder.Image square />
                </Placeholder>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Card.Content>
              </Card>
            </Grid.Column>
          }
          <Grid.Column mobile={16} tablet={8} computer={12}>
            <Segment>
              <Activity idArea={0} idSector={0} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Frontpage;
