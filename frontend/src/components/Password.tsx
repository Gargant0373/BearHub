import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkPassword, setPassword, getPersonData } from "../api/ApiHandler";
import { Person } from "../api/DataTypes";

function PasswordField() {
    const location = useLocation();
    const { name } = location.state as { name: string };

    const [passwordOld, setPasswordOld] = useState('');
    const [password, setPass] = useState('');
    const [personData, setPersonData] = useState<Person>();

    useEffect(() => {
        fetchData();
    }, [personData]);

    const fetchData = async () => {
        try {
            setPersonData(await getPersonData(name));
        } catch (error: any) {
            console.error(error.message);
        }
    };

    return (
        <Grid container item xs={12} md={6}>
            <Grid item xs={2} md={3} />
            <Grid item xs={8} md={6}>
                <Grid item xs={12}>
                    {
                        (personData?.password !== undefined && personData?.password !== null)
                            ? (
                                <><Grid item xs={12}>
                                    <Typography variant="h6">Enter old password</Typography>
                                </Grid><Grid item xs={12}>
                                        <TextField
                                            label="Password"
                                            variant="outlined"
                                            value={passwordOld}
                                            onChange={(event) => setPasswordOld(event.target.value)}
                                            fullWidth />
                                    </Grid></>)
                            : (<></>)
                    }
                    <Grid item xs={12}>
                        <Typography variant="h6">Set new password</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={(event) => setPass(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid marginTop="10px" item xs={12}>
                    <Button type="submit" variant="contained" onClick={
                        async () => {
                            if (personData?.password !== undefined) {
                                let valid: boolean = await checkPassword(name, passwordOld);
                                if (!valid) {
                                    alert('Invalid Password!');
                                    setPasswordOld('');
                                    return;
                                }
                            }
                            setPassword(name, password, passwordOld);
                            setPass('');
                            setPasswordOld('');
                        }
                    }>Set New Password</Button>
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
                            if (!valid) {
                                alert('Invalid Password!');
                                setProvidedPassword('');
                                return;
                            }

                            props.setLogged(providedPassword);
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

