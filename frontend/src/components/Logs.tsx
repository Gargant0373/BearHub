import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';

const ROWS_PER_PAGE = 10;

interface Log {
  timestamp: string;
  personName: string;
  action: string;
  type?: string;
  paidAmount?: number;
}

function Logs() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (selectedDate) {
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          const response = await axios.get(``);
          setLogs(response.data);
          setPage(0);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const logsPerPage = logs.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label="Pick a Date"
            value={dayjs(selectedDate)}
            onChange={(newValue) => handleDateChange(newValue == null ? null : newValue.toDate())}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'right' }
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12}>
        {logs.length === 0 ? (
          <Typography>No logs found for the selected date.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Person</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Paid Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsPerPage.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.personName}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell>{log.paidAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={logs.length}
          rowsPerPage={ROWS_PER_PAGE}
          page={page}
          onPageChange={handleChangePage}
        />
      </Grid>
    </Grid>
  );
};

export default Logs;
