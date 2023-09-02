import { Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TodayGraph from '../components/TodayGraph';
import { Login } from '../components/Password';

interface PersonData {
  name: string; // this is the ID
  smallBeers: number;
  bigBeers: number;
  toPay: number;
  beefJerky: number;
  password?: string;
}

const SMALL_BEER_SIZE = 0.33;
const BIG_BEER_SIZE = 0.5;

function Beers(props: { SERVER_PATH: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [peopleData, setPeopleData] = useState<PersonData[]>([]);
  const [logged, setLogged] = useState<boolean>(false);

  if (!location.state) {
    navigate("/");
    return null;
  }

  const { name } = location.state as { name: string };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${props.SERVER_PATH}/api/people`);
      setPeopleData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addJerky = async (personName: string) => {
    try {
      await axios.post(`${props.SERVER_PATH}/api/people/${personName}/beefJerky`);
      fetchData();
    } catch (error) {
      console.error('Error adding beef jerky:', error);
    }
  };

  const addBeer = async (personName: string, beerType: 'small' | 'big') => {
    try {
      await axios.post(`${props.SERVER_PATH}/api/people/${personName}/beers`, { type: beerType });
      fetchData();
    } catch (error) {
      console.error('Error adding beer:', error);
    }
  };

  const deletePerson = async (personName: string) => {
    try {
      await axios.delete(`${props.SERVER_PATH}/api/people/${personName}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const paidPerson = async (personName: string) => {
    try {
      if (peopleData.find((person) => person.name === personName)?.toPay === 0) return;
      await axios.post(`${props.SERVER_PATH}/api/people/${personName}/pay`);
      fetchData();
    } catch (error) {
      console.error('Error paying person:', error);
    }
  };

  {
    if (peopleData.find((person) => person.name === name)?.password != null && !logged) {
      return (
        <Login SERVER_PATH={props.SERVER_PATH} setLogged={setLogged} />
      )
    }
  }

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
          {name === 'Dani' && (
            <Grid item xs={12} md={8} sx={{
              justifyContent: { xs: 'center', md: 'right' }
            }} display="flex" alignItems="right">
              <Button type="submit" variant="contained" onClick={(event) => {
                event.preventDefault();
                navigate('/user', { state: { name } });
              }}>User</Button>
            </Grid>
          )}
          <Grid item xs={0} md={2} />
        </Grid>
        <Grid item xs={12} spacing={3} display="flex" justifyContent="center" alignItems="center">
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
              <Button variant="contained" onClick={() => addBeer(name, 'small')}>
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
              <Button variant="contained" onClick={() => addBeer(name, 'big')}>
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
              <Button variant="contained" onClick={() => addJerky(name)}>
                +
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <BeerData name={name} peopleData={peopleData} paidPerson={paidPerson} deletePerson={deletePerson} />
        <Grid item xs={12} md={6}>
          <TodayGraph SERVER_PATH={props.SERVER_PATH} />
        </Grid>
      </Grid >
      </>
  );
};

function BeerData(props: { name: string, peopleData: PersonData[], paidPerson: (personName: string) => void, deletePerson: (personName: string) => void }) {
  return (
    <>
      <Grid item xs={12} md={6} display="flex" justifyContent="right" alignItems="right">
        <TableContainer>
          <Typography variant="h5" fontSize="150%">Your Consumption</Typography>
          <Divider />
          <Table>
            <TableHead>
              <TableRow>
                {props.name === 'Dani' && (
                  <TableCell>Name</TableCell>
                )}
                <TableCell>Small Beers</TableCell>
                <TableCell>Big Beers</TableCell>
                <TableCell>Beef Jerkys</TableCell>
                <TableCell>Total (L)</TableCell>
                {props.name === 'Dani' && (
                  <>
                    <TableCell>Total</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.peopleData.filter(person => person.name === props.name || props.name === 'Dani').map((person) => (
                <TableRow key={person.name}>
                  {props.name === 'Dani' && (
                    <TableCell>{person.name}</TableCell>
                  )}
                  <TableCell>{person.smallBeers}</TableCell>
                  <TableCell>{person.bigBeers}</TableCell>
                  <TableCell>{person.beefJerky}</TableCell>
                  <TableCell>
                    {(person.smallBeers * SMALL_BEER_SIZE + person.bigBeers * BIG_BEER_SIZE).toFixed(2)} L
                  </TableCell>
                  {props.name === 'Dani' && (
                    <>
                      <TableCell>
                        {person.toPay ? person.toPay : 0}
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" onClick={() => props.paidPerson(person.name)}>
                          Paid
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" onClick={() => props.deletePerson(person.name)}>
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
