import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { checkPassword } from "../api/ApiHandler";

function PasswordField() {
    const location = useLocation();
    
    const { name } = location.state as { name: string };
    const [password, setPassword] = useState('');

    return (
        <Grid container item xs={12} md={6}>
            <Grid item xs={2} md={3} />
            <Grid item xs={8} md={6}>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Set Password</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid marginTop="10px" item xs={12}>
                    <Button type="submit" variant="contained" onClick={
                        (event) => {
                            event.preventDefault();
                        }
                    }>Set Password</Button>
                </Grid>
            </Grid>
            <Grid item xs={2} md={3} />
        </Grid>
    )
}

function Login(props: { setLogged: any }) {
    const location = useLocation();
    const { name } = location.state as { name: string };
    
    const [providedPassword, setProvidedPassword] = useState('');

    return (
        <Grid container item xs={12} display="flex" alignItems="center">
            <Grid item xs={2} md={3} />
            <Grid item xs={8} md={6}>
                <Grid item xs={12}>
                    <Typography variant="h6">Login</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{
                        marginTop: "4px",
                        marginBottom: "12px"
                    }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Password" variant="outlined" fullWidth onChange={(event) => setProvidedPassword(event.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" onClick={
                        async () => {
                            let valid: boolean = await checkPassword(name, providedPassword);
                            if(!valid) {
                                alert('Invalid Password!');
                                setProvidedPassword('');
                                return;
                            }

                            props.setLogged(true);
                        }
                    } sx={{
                        marginTop: "10px",
                    }}>Login</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export { Login, PasswordField };

