import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getMeter } from "../api/ApiHandler";
import { Beer } from "../api/DataTypes";

function Meter(props: { beerData: Record<string, Beer> }) {
    const [meter, setMeter] = useState(0);
    const [imagePath, setImagePath] = useState("");

    useEffect(() => {
        fetchMeterData();
    }, []);

    useEffect(() => {
        fetchMeterData();
    }, [props.beerData]);

    const fetchMeterData = async () => {
        try {
            setMeter(await getMeter());
            setImagePath(getImagePath(meter));
        } catch (err) {
            console.log(err);
        }
    };

    const getImagePath = (meter: number) => {
        return "/alco" + (meter / 7 > 10 ? 10 : Math.floor(meter / 7)) + ".jpg";
    };

    return (
        <Grid container item xs={12} display="flex" textAlign="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography variant="h6" width="100%" textAlign="center">
                    Today we drank {meter} liters of beer!
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {imagePath && <img src={imagePath} alt={`Meter Image for ${meter} liters of beer`} />}
            </Grid>
        </Grid>
    );
}

export { Meter };
