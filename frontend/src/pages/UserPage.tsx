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

    const { name, logged } = location.state as { name: string, logged: string | null };

    return (
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
                        navigate('/customize', { state: { name, logged } });
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
