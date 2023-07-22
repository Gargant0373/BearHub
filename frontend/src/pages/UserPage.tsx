import { Button, Divider, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Logs from '../components/Logs';

function UserPage(props: {SERVER_PATH: string, SMALL_BEER_PRICE: number, LARGE_BEER_PRICE: number}) {
    const location = useLocation();
    const navigate = useNavigate();

    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'))

    if (!location.state) {
        navigate("/");
        return null;
    }

    const { name } = location.state as { name: string };

    return (
        <Grid container spacing={2}>
            <Grid item md={1} xs={12}>
                <Button type="submit" variant="contained" onClick={(event) => {
                    event.preventDefault();
                    navigate('/beers', { state: { name } });
                }}>Go Back</Button>
            </Grid>
            <Grid item md={10} xs={12} display="flex" alignItems="center" justifyContent="center">
                <Typography variant="h4" gutterBottom>
                    Welcome, {name}!
                </Typography>
            </Grid>
            <Grid item md={1} xs={0} />

            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid container item xs={12} md={6}>
                <Grid item xs={2} md={3} />
                <Grid item xs={8} md={6}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Change Password</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Set Password"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid marginTop="10px" item xs={12}>
                        <Button type="submit" variant="contained">Set Password</Button>
                    </Grid>
                </Grid>
                <Grid item xs={2} md={3} />
            </Grid>

            {isMatch && <Grid item xs={12}>
                <Divider />
            </Grid>}
            <Grid item xs={12} md={6}>
                <Logs {...props} />
            </Grid>
        </Grid >
    );
}

export default UserPage;
