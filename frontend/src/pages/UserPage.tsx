import { Button, Divider, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Logs from '../components/Logs';
import { PasswordField } from '../components/Password';

function UserPage(props: { SERVER_PATH: string }) {
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
            <PasswordField SERVER_PATH={props.SERVER_PATH} />

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
