import { Grid, Table, TableCell, TableHead, TableRow, TextField, Button, Typography, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";
import { getPersonsData } from "../api/ApiHandler";
import { Person } from "../api/DataTypes";

function UserLookup() {
    const [personData, setPersonData] = useState<Record<string, Person>>({});
    const [filter, setFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    let fetchData = async () => {
        setPersonData(await getPersonsData());
    };

    let filteredKeys = Object.keys(personData).filter((k: string) =>
        k.toLowerCase().startsWith(filter)
    );

    let totalPageCount = Math.ceil(filteredKeys.length / itemsPerPage);
    let displayData = filteredKeys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Grid container item xs={12}>
            <Grid container item xs={12} md={6}>
                <Typography variant="h6" textAlign="center" width="100%">User Lookup</Typography>
            </Grid>
            <Grid container item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
                <TextField
                    id="standard"
                    label="Filter"
                    onChange={(e: any) => {
                        setFilter(e.target.value.toLowerCase());
                        setCurrentPage(1);
                    }}
                />
            </Grid>
            <Grid container item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Small Beers</TableCell>
                                <TableCell>Large Beers</TableCell>
                                <TableCell>Beef Jerky</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell>Password</TableCell>
                            </TableRow>

                            {displayData.map((k: string) => (
                                <TableRow key={k}>
                                    <TableCell>{k}</TableCell>
                                    <TableCell>{personData[k].small_beers}</TableCell>
                                    <TableCell>{personData[k].big_beers}</TableCell>
                                    <TableCell>{personData[k].beef_jerky}</TableCell>
                                    <TableCell>
                                        {personData[k].admin !== undefined && personData[k].admin
                                            ? "true"
                                            : "false"}
                                    </TableCell>
                                    <TableCell>
                                        {personData[k].password !== undefined &&
                                            personData[k].password !== null
                                            ? "true"
                                            : "false"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableHead>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={6} display="flex" alignItems="left" justifyContent="flex-start">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous Page
                    </Button>
                </Grid>
                <Grid item xs={6} display="flex" alignItems="right" justifyContent="right">
                    <Button onClick={handleNextPage} disabled={currentPage === totalPageCount}>
                        Next Page
                    </Button>
                </Grid>
            </Grid>
        </Grid >
    );
}

export default UserLookup;
