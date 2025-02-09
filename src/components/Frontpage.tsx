import { Helmet } from "react-helmet";
import {
  Label,
  Grid,
  Statistic,
  Icon,
  Image,
  Card,
  Segment,
  Placeholder,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMeta } from "./common/meta";
import { getImageUrl, numberWithCommas, useData } from "../api";
import Activity from "./common/activity/activity";

const Frontpage = () => {
  const meta = useMeta();
  const { data: frontpage } = useData(`/frontpage`);
  const type = meta.isBouldering ? "bouldering problems" : "climbing routes";
  const description = `${frontpage?.numProblems} ${type}, ${frontpage?.numTicks} public ascents, ${frontpage?.numImages} images, ${frontpage?.numMovies} ascents on video.`;

  return (
    <>
      {frontpage && (
        <Helmet>
          <meta name="description" content={description}></meta>
        </Helmet>
      )}
      <Grid>
        <Grid.Row>
          {frontpage ? (
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Statistic.Group size="mini" horizontal as={Segment}>
                <Statistic as={Link} to="/problems" color="blue">
                  <Statistic.Value>
                    <Icon name="database" />{" "}
                    {numberWithCommas(frontpage.numProblems)}
                  </Statistic.Value>
                  <Statistic.Label>
                    {meta.isBouldering ? "Problems" : "Routes"}
                  </Statistic.Label>
                </Statistic>
                {meta.isClimbing ? (
                  <Statistic>
                    <Statistic.Value>
                      <Icon name="image outline" />{" "}
                      {numberWithCommas(frontpage.numProblemsWithTopo)}
                    </Statistic.Value>
                    <Statistic.Label>With topo</Statistic.Label>
                  </Statistic>
                ) : (
                  <Statistic>
                    <Statistic.Value>
                      <Icon name="map marker" />{" "}
                      {numberWithCommas(frontpage.numProblemsWithCoordinates)}
                    </Statistic.Value>
                    <Statistic.Label>Coordinates</Statistic.Label>
                  </Statistic>
                )}
                <Statistic as={Link} to="/ticks/1" color="blue">
                  <Statistic.Value>
                    <Icon name="check" /> {numberWithCommas(frontpage.numTicks)}
                  </Statistic.Value>
                  <Statistic.Label>Ticks</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>
                    <Icon name="image" />{" "}
                    {numberWithCommas(frontpage.numImages)}
                  </Statistic.Value>
                  <Statistic.Label>Images</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>
                    <Icon name="film" /> {numberWithCommas(frontpage.numMovies)}
                  </Statistic.Value>
                  <Statistic.Label>Videos</Statistic.Label>
                </Statistic>
                <Statistic as={Link} to={"/donations"} color="blue">
                  <Statistic.Value>
                    <Icon name="money" />
                  </Statistic.Value>
                  <Statistic.Label>Donations</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              {frontpage.randomMedia && (
                <>
                  <Card>
                    <Link to={`/problem/${frontpage.randomMedia.idProblem}`}>
                      <Image
                        size="medium"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                        src={getImageUrl(
                          frontpage.randomMedia.idMedia,
                          frontpage.randomMedia.crc32,
                          275,
                        )}
                      />
                    </Link>
                    <Card.Content>
                      <Card.Header
                        as={Link}
                        to={`/problem/${frontpage.randomMedia.idProblem}`}
                      >
                        {frontpage.randomMedia.problem}{" "}
                        {frontpage.randomMedia.grade}
                      </Card.Header>
                      <Card.Description>
                        <Link to={`/area/${frontpage.randomMedia.idArea}`}>
                          {frontpage.randomMedia.area}
                        </Link>{" "}
                        /{" "}
                        <Link to={`/sector/${frontpage.randomMedia.idSector}`}>
                          {frontpage.randomMedia.sector}
                        </Link>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Label.Group size="mini">
                        {frontpage.randomMedia.tagged &&
                          frontpage.randomMedia.tagged.map((x) => (
                            <Label
                              basic
                              key={x.id}
                              as={Link}
                              to={`/user/${x.id}`}
                            >
                              <Icon name="user" />
                              {x.name}
                            </Label>
                          ))}
                        {frontpage.randomMedia.photographer && (
                          <Label
                            basic
                            as={Link}
                            to={`/user/${frontpage.randomMedia.photographer.id}`}
                          >
                            <Icon name="photo" />
                            {frontpage.randomMedia.photographer.name}
                          </Label>
                        )}
                      </Label.Group>
                    </Card.Content>
                  </Card>
                  <br />
                </>
              )}
            </Grid.Column>
          ) : (
            <Grid.Column
              mobile={16}
              tablet={8}
              computer={4}
              style={{ marginBottom: "10px" }}
            >
              <Segment>
                <Placeholder>
                  {[...Array(6)].map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Placeholder.Header image key={i}>
                      <Placeholder.Line />
                    </Placeholder.Header>
                  ))}
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
          )}
          <Grid.Column mobile={16} tablet={8} computer={12}>
            <Segment>
              <Activity idArea={0} idSector={0} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default Frontpage;
