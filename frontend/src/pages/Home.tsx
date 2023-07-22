import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// use state to store how many beers each person drank

function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        navigate('/beers', { state: { name } });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <img src="../../public/bear.png" height="150px" width="auto" alt="Bear" />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h4">Enter your name.</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Button type="submit" variant="contained">
                        Get your bear!
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default Home;