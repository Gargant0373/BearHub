import { Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Login } from '../components/Password';
import { deleteBeerData, getBeersData, getPersonsData, incrementBeerData, payBeerData } from '../api/ApiHandler';
import { Beer, Person } from '../api/DataTypes';
import { Meter } from '../components/Meter';

function Beers() {
  const location = useLocation();
  const navigate = useNavigate();

  const [logged, setLogged] = useState<string | null>(null);

  if (!location.state) {
    navigate("/");
    return null;
  }

  const { name } = location.state as { name: string };

  const [beerData, setBeerData] = useState<Record<string, Beer>>({});
  const [personData, setPersonData] = useState<Record<string, Person>>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [logged]);

  const fetchData = async () => {
    try {
      setBeerData(await getBeersData(name, logged));
      setPersonData(await getPersonsData(name, logged));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  {
    if (personData[name] && personData[name]?.password && !logged) {
      return (
        <Login setLogged={setLogged} />
      )
    }
  }

  const admin: boolean = personData[name] != undefined && personData[name].admin == true;

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid container item xs={12} display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={0} md={1} />
          <Grid item xs={12} md={10} display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" fontSize="150%" marginTop={"20px"}>Beers for {name}</Typography>
          </Grid>
          <Grid item xs={0} md={1} />
          <Grid item xs={12}>
            <Divider sx={{
              marginTop: "4px",
              marginBottom: "12px"
            }} />
          </Grid>
          <Grid item xs={0} md={2} />
          {admin && (
            <Grid item xs={12} md={8} sx={{
              justifyContent: { xs: 'center', md: 'right' }
            }} display="flex" alignItems="right">
              <Button type="submit" variant="contained" onClick={(event) => {
                event.preventDefault();
                navigate('/user', { state: { name, logged } });
              }}>User</Button>
            </Grid>
          )}
          <Grid item xs={0} md={2} />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
          <Grid container spacing={1} item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Box sx={{
                width: {
                  xs: '80%',
                  md: '50%'
                },
                height: "auto"
              }}>
                <img src="/small.png" width="100%" height="auto" />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" fontSize="100%" textAlign="center">Small Beer</Typography>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Button variant="contained" onClick={() => {
                incrementBeerData(name, 'small');
                fetchData();
              }}>
                +
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Box sx={{
                width: {
                  xs: '80%',
                  md: '50%'
                },
                height: "auto"
              }}>
                <img src="/large.png" width="100%" height="auto" />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" fontSize="100%" textAlign="center">Large Beer</Typography>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Button variant="contained" onClick={() => {
                incrementBeerData(name, 'big');
                fetchData();
              }}>
                +
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Box sx={{
                width: {
                  xs: '80%',
                  md: '50%'
                },
                height: "auto"
              }}>
                <img src="/jerky.jpeg" width="100%" height="auto" />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" fontSize="100%" textAlign="center">Beef Jerky</Typography>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <Button variant="contained" onClick={() => {
                incrementBeerData(name, 'jerky');
                fetchData();
              }}>
                +
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <BeerData name={name} beerData={beerData} personData={personData} admin={admin} fetchData={fetchData} logged={logged} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Meter beerData={beerData} />
        </Grid>
      </Grid >
    </>
  );
};

function BeerData(props: {
  name: string, beerData: Record<string, Beer>,
  personData: Record<string, Person>,
  admin: boolean,
  fetchData: () => Promise<void>,
  logged: string | null
}) {
  return (
    <>
      <Grid item xs={12} md={8} display="flex" justifyContent="center" alignItems="center">
        <TableContainer>
          <Typography variant="h5" fontSize="150%" textAlign="center" marginTop="15px">Your Consumption</Typography>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                {props.admin && (
                  <TableCell>Name</TableCell>
                )}
                <TableCell>Small Beers</TableCell>
                <TableCell>Big Beers</TableCell>
                <TableCell>Beef Jerkys</TableCell>
                <TableCell>Total (L)</TableCell>
                {props.admin && (
                  <>
                    <TableCell>Total</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Object.keys(props.beerData).filter((c: string) => c === props.name || props.admin)
                  .map((c: string) => (
                    <TableRow key={c}>
                      {props.admin && (
                        <TableCell>{c}</TableCell>
                      )}
                      <TableCell>{props.beerData[c].small_beers}</TableCell>
                      <TableCell>{props.beerData[c].big_beers}</TableCell>
                      <TableCell>{props.beerData[c].beef_jerky}</TableCell>
                      <TableCell>
                        {(props.beerData[c].small_beers * 0.33 + props.beerData[c].big_beers * 0.5).toFixed(2)} L
                      </TableCell>
                      {props.admin && (
                        <>
                          <TableCell>
                            {props.beerData[c].to_pay}
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" onClick={() => {
                              payBeerData(c, props.name);
                              props.fetchData();
                            }}>
                              Paid
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" onClick={() => {
                              deleteBeerData(c, props.name); props.fetchData();
                            }}>
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}

export default Beers;
