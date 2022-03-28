import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@material-ui/core";
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setTab } from '../../reducers/navigation';
import { getTimeFromSlot } from '../../utils/time';
import { SERVER_URL } from '../../config/url';

/**
 * component for vaccine bookings table
 */
export default function VaccineRegistrationListing(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    books: [], // vaccine reservations
    VaccineCenters: [] // centers
  });

  // load vaccine reservations for selected center
  const fetchBookingVaccinations = (callback, centers) => {
    fetch(SERVER_URL + "/books")
    .then(response => response.json())
    .then(books => {
      callback(books, centers)
    });
  }

  // load centers
  const fetchCenters = (callback) => {
    fetch(SERVER_URL + "/centers")
    .then(response => response.json())
    .then(centers => {
      callback(centers)
    });
  }

  // delete seleted booking
  const handleDelete = (event, id) => {
    event.preventDefault();

    axios.delete(`${SERVER_URL}/books/` + id)
    .then(res => {
      fetchBookingVaccinations((books) => {
        setState({ ...state, books: books });
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const onClickEdit = function(e, id) {
    e.preventDefault(); 
    dispatch(setTab('/'));
    props.history.push('/bookings/' + id);
  }

  // load centers, bookings
  useEffect(() => {
    fetchCenters((centers) => {
      fetchBookingVaccinations((books) => {
        setState({ ...state, VaccineCenters: centers, books: books });
      }, centers);
    });
  }, []) 

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box sx={{mt: 8}}>
          <Typography component="h1" variant="h5">
            Active Booking
          </Typography>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Center Name</TableCell>
                  <TableCell align="left">Start Time</TableCell>
                  <TableCell align="left">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.books.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.Center.name}</TableCell>
                    <TableCell align="left">
                      {row.date.toString().slice(0, 10) + " " + getTimeFromSlot(row.slot_number)}
                    </TableCell>
                    <TableCell align="left">
                      <Button onClick={(e) => onClickEdit(e, row.id)}>
                        <EditIcon />
                      </Button>
                      <Button onClick={(e) => handleDelete(e, row.id)}>
                        <DeleteIcon/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
}
