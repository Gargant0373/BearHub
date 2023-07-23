import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import * as crypto from 'crypto-js';
import { useState } from "react";
import { useLocation } from "react-router-dom";

// Function to encrypt data using SHA256
function encryptData(data: string): string {
    return crypto.SHA256(data).toString();
}

function PasswordField(props: { SERVER_PATH: string }) {
    const location = useLocation();
    const { name } = location.state as { name: string };

    // Function to update the password on the server
    async function updatePassword(personName: string, password: string) {
        const encryptedPassword: string = encryptData(password);

        try {
            await axios.post(`${props.SERVER_PATH}/api/people/${personName}/password`, {
                password: encryptedPassword,
            });

        } catch (error: any) {
            console.error(error.message);
        }
    }

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
                            updatePassword(name, password);
                        }
                    }>Set Password</Button>
                </Grid>
            </Grid>
            <Grid item xs={2} md={3} />
        </Grid>
    )
}

function Login(props: { SERVER_PATH: string, setLogged: any }) {
    const location = useLocation();

    const { name } = location.state as { name: string };

    const [providedPassword, setProvidedPassword] = useState('');

    // Function to check if the provided password matches the password from the data
    async function checkPasswordMatch(password: string): Promise<boolean> {
        const encryptedPassword: string = encryptData(password);

        try {
            const response = await axios.get(`${props.SERVER_PATH}/api/people/${name}/validatePassword`, {
                params: { password: encryptedPassword },
            });

            if (response && response.data && response.data.valid) {
                return response.data.valid;
            }
        } catch (error: any) {
            console.error(error.message);
        }

        return false;
    }

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
                            const isMatch: boolean = await checkPasswordMatch(providedPassword);
                            if (isMatch) {
                                props.setLogged(true);
                                return;
                            }
                            alert('Incorrect password');
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
