import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Divider, Grid, Input, Tooltip, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPrices } from '../api/ApiHandler';

function Customize() {
  const location = useLocation();
  const navigate = useNavigate();

  const [prices, setPrices] = useState<{ small_beer: number, big_beer: number, beef_jerky: number }>({ small_beer: 0, big_beer: 0, beef_jerky: 0 });

  if (!location.state) {
    navigate("/");
    return null;
  }

  const { name, logged } = location.state as { name: string, logged: string | null };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setPrices(await getPrices());
    } catch (error: any) {
      console.error(error.message);
    } // TODO: Make the user page navbar a component
  };

  return (
    <>
      <Grid container spacing={0}>
        <Grid item md={1} xs={4}>
          <Button type="submit" variant="contained" onClick={(event) => {
            event.preventDefault();
            navigate('/beers', { state: { name } });
          }}>Go Back</Button>
        </Grid>
        <Grid item md={1} xs={2} display="flex" alignContent="center" justifyContent="left">
          <Tooltip title="Customize" placement="top" sx={{
            marginTop: "7px",
          }}>
            <SettingsIcon color='primary' onClick={(event) => {
              event.preventDefault();
              navigate('/customize', { state: { name } });
            }} />
          </Tooltip>
        </Grid>
        <Grid item md={12} xs={12} display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h4" gutterBottom>
            Welcome, {name}!
          </Typography>
        </Grid>
        <Grid item md={1} xs={0} />

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid container item xs={12}>
          <Grid container item xs={6} display="flex" flexDirection="column">
            <PriceField name="small_beer" prices={prices} setPrices={setPrices} />
            <PriceField name="big_beer" prices={prices} setPrices={setPrices} />
            <PriceField name="beef_jerky" prices={prices} setPrices={setPrices} />
          </Grid>
        </Grid>
      </Grid >
    </>
  )
}

function PriceField(props: {
  name: string,
  prices: { small_beer: number, big_beer: number, beef_jerky: number }, setPrices: Dispatch<SetStateAction<{ small_beer: number; big_beer: number; beef_jerky: number; }>>
}) {

  let prettify = (name: string) => {
    return name.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  let handleChange = (event: any) => {
    let newPrices = props.prices;
    // @ts-ignore
    newPrices[props.name] = event.target.value === '' ? 0 : Number(event.target.value);

    props.setPrices(newPrices);
  };

  return <>
    <Grid container item xs={4}>
      <Grid item xs={12}>
        <Typography variant="h6" id="input-text">
          {prettify(props.name)}
        </Typography>
        <Input
          onChange={handleChange}
          // @ts-ignore
          value={props.prices[props.name]}
          size="small"
          inputProps={{
            step: 0.5,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-text',
          }}
        />
      </Grid>
    </Grid>
  </>
}

export default Customize;