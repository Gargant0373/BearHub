import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Divider, Grid, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordField } from '../components/Password';
import Stats from '../components/Stats';
import UserLookup from '../components/UserLookup';

function UserPage() {
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
            <Grid item md={1} xs={6}>
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
            <Grid item md={1} xs={12} display="flex" alignContent="center" justifyContent="center">
                <Tooltip title="Customize" placement="top">
                    <SettingsIcon color='primary' onClick={(event) => {
                        event.preventDefault();
                        navigate('/customize', { state: { name } });
                    }} />
                </Tooltip>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>
            <PasswordField />

            {isMatch && <Grid item xs={12}>
                <Divider />
            </Grid>}
            <Grid item xs={12} md={6}>
                <Stats />
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
                <UserLookup />
            </Grid>
        </Grid >
    );
}

export default UserPage;
