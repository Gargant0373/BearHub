import { useEffect, useState } from "react";
import { Stat } from "../api/DataTypes";
import { getStatData } from "../api/ApiHandler";
import { Grid, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";

function Stats() {

  const [statData, setStatData] = useState<Stat>({ small_beers: 0, big_beers: 0, beef_jerky: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setStatData(await getStatData());
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" display="flex">
        <Grid container item xs={12}>
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>This Month's Consumption</Typography>
        </Grid>
        <Grid container item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Small Beers
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Big Beers
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Beef Jerky
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>
                  {statData.small_beers}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {statData.big_beers}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {statData.beef_jerky}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </Grid>
    </>
  )
};

export default Stats;
