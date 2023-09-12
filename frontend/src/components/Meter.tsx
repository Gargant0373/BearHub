import { useEffect, useState } from "react";
import { Beer } from "../api/DataTypes";
import { getMeter } from "../api/ApiHandler";

function Meter(props: { beerData: Record<string, Beer> }) {

    let [meter, setMeter] = useState(0);

    useEffect(() => {
        fetchData();
    }, [props.beerData]);

    const fetchData = async () => {
        try {
            setMeter(await getMeter());
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <>
            
        </>
    )
}