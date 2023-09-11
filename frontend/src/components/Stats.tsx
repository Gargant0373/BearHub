import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Grid, Table, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getStatData } from "../api/ApiHandler";
import { Stat } from "../api/DataTypes";

function Stats() {

  const [statData, setStatData] = useState<Stat>({ small_beers: 0, big_beers: 0, beef_jerky: 0 });
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear]);

  const fetchData = async () => {
    try {
      setStatData(await getStatData(currentYear * 100 + currentMonth));
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const next: () => void = () => {
    if (currentMonth == 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
      return;
    }

    setCurrentMonth(currentMonth + 1);
  }

  const prev: () => void = () => {
    if (currentMonth == 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
      return;
    }

    setCurrentMonth(currentMonth - 1);
  }

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" display="flex">
        <Grid container item xs={12}>
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
            {currentYear} / {currentMonth < 10 ? "0" + currentMonth : currentMonth} Consumption
          </Typography>
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
        <Grid container item xs={12} display="flex" justifyContent="center" alignItems="center" marginTop="15px">
          <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Previous Month">
              <NavigateBeforeIcon onClick={prev} />
            </Tooltip>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Next Month">
              <NavigateNextIcon onClick={next} />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid >
    </>
  )
};

export default Stats;
