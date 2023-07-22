import { Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const SMALL_BEER_SIZE = 0.33;
const BIG_BEER_SIZE = 0.5;

interface Log {
    timestamp: string;
    personName: string;
    action: string;
    type?: string;
    toPay?: number;
}

interface BeerData {
    timestamp: string;
    hour: number;
    minute: number;
    liters: number;
}

function BeerGraph(props: { SERVER_PATH: string }) {
    const [beerData, setBeerData] = useState<BeerData[]>([]);

    let max = 0;
    async function getData() {
        const currentTime = new Date(); // Get the current time
    
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2); // Calculate the time 2 hours ago
    
        const response = await axios.get(`${props.SERVER_PATH}/api/logs`); // Fetch the logs data
    
        const logs: Log[] = response.data;
    
        const beerData: BeerData[] = [];
    
        // Create an object to track beer consumption for each hour and minute
        const beerConsumption: { [key: string]: number } = {};
    
        // Iterate over the logs and calculate beer consumption for the past 2 hours
        logs.forEach((log: Log) => {
            const { timestamp, action, type } = log;
    
            if (action === "ADD") {
                const logTime = new Date(timestamp);
    
                // Check if the log entry is within the past 2 hours
                if (logTime >= twoHoursAgo && logTime <= currentTime) {
                    const hour = logTime.getHours();
                    const minute = logTime.getMinutes();
                    const key = `${hour}:${minute}`;
    
                    if (!beerConsumption[key]) {
                        beerConsumption[key] = 0;
                    }
    
                    const liters = (type === "small" ? SMALL_BEER_SIZE : BIG_BEER_SIZE);
                    beerConsumption[key] += liters;
                }
            }
        });
    
        // Convert beer consumption object to BeerData array
        for (const key in beerConsumption) {
            if (beerConsumption.hasOwnProperty(key)) {
                const [hour, minute] = key.split(":").map(Number);
                const liters = Number(beerConsumption[key].toFixed(2));
                const timestamp = `${hour}:${minute}`;
                beerData.push({ timestamp, hour, minute, liters });
            }
        }
    
        return beerData;
    }

    const fetchData = async () => {
        try {
            setBeerData(await getData());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [beerData]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h4">Today's Performance</Typography>
                </Grid>
                <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                    <AreaChart width={375} height={250} data={beerData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis domain={[0, max]} />
                        <Area type="monotone" dataKey="liters" fill="#8884d8" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </AreaChart>
                </Grid>
            </Grid>
        </>
    );
};

export default BeerGraph;
