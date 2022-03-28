import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import DatePicker from "@mui/lab/DatePicker";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { getTimeSlots } from '../../utils/time';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setTab } from '../../reducers/navigation';
import { SERVER_URL } from '../../config/url';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    '& .MuiSelect-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(0)
    },
    '& .MuiButton-root': {
      marginTop: theme.spacing(3),
    }
  },
}));


// component for register/update vaccine reservation
export default function VaccineRegistration(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    center: 0, // selected center
    date: new Date(), // selected date
    name: "", // user name
    nric: 0, // user id
    slot_number: 0, // selected slot number(time)
    slot_numbers: [], // avaiable slot numbers array
    VaccineCenters: [] // centers
  }); 
  const editing = Boolean(props.match.params.bookingId); // the state for editing a booking

  // when selecting a center, reloads slot nubmers array. 
  const handleSelect = (event) => {
    fetchSlotNumbers((slot_numbers) => {
      setState({...state, center: event.target.value, slot_numbers: slot_numbers});
    }, event.target.value, state.date);
  }

  const handleTimeChange = (event) => {
    setState({...state, slot_number: event.target.value});
  }

  // when changing date, reloads slot nubmers array. 
  const handleDateChange = (value) => {
    fetchSlotNumbers((slot_numbers) => {
      setState({...state, date: value, slot_numbers: slot_numbers});
    }, state.center, value);
  }

  // when changing nric, name
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  }

  // returns slot numbers
  const fetchSlotNumbers = (callback, center, date) => {
    axios.post(`${SERVER_URL}/books/booked_slots`, { date: date, center: center})
    .then(res => {
      callback(getTimeSlots(res));
    })
    .catch((error) => {
      console.dir('Error:', error);
    });
  }

  const validPayload = () => {
    if(!state.nric) {
      alert('NRIC required');
      return false;
    }
    if(!state.name) {
      alert('Full Name required');
      return false;
    }
    if(state.center == 0) {
      alert('Center required');
      return false;
    }
    if(state.slot_number == null || state.slot_number < 0) {
      alert('Slot number required');
      return false;
    }
    if(!state.slot_numbers[state.slot_number].avaiable) {
      alert('Please select slot.');
      return false;
    }
    return true;
  }

  // create/update a booking
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!validPayload()) return;

    if(editing) { // editing
      axios.put(`${SERVER_URL}/books/` + props.match.params.bookingId, {...state})
      .then(res => {
        props.history.push('/bookings');
        dispatch(setTab('/bookings'));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    else {
      axios.post(`${SERVER_URL}/books`, {...state})
      .then(res => {
        if(res.status === 203) {
          alert(res.data);
        }
        else {
          props.history.push('/bookings');
          dispatch(setTab('/bookings'));
        }
      })
      .catch((error) => {
        console.dir('Error:', error);
      });
    }
  }

  // initialize centers, slot_numbers list
  useEffect(() => {
    fetch(SERVER_URL + "/centers")
    .then(response => response.json())
    .then(centers => {
      if(editing) { // editing
        fetch(SERVER_URL + "/books/" + props.match.params.bookingId)
        .then(response => response.json())
        .then(book => {
          axios.post(`${SERVER_URL}/books/booked_slots`, { center: book.center, date: book.date})
          .then(res => {
            setState({
              center: book.center,
              date: book.date,
              name: book.name,
              nric: book.nric,
              slot_number: book.slot_number,
              slot_numbers: getTimeSlots(res, book.slot_number),
              VaccineCenters: centers
            });
          })
          .catch((error) => {
            console.dir('Error:', error);
          });
        });
      }
      else { // creating
        fetch(SERVER_URL + "/centers")
        .then(response => response.json())
        .then(centers => {
          fetchSlotNumbers((slot_numbers) => {
            setState({ ...state, slot_numbers: slot_numbers, VaccineCenters: centers });
          }, state.center, state.date);
        })
        .catch((error) => {
          console.dir('Error:', error);
        });
      }
    });
  }, [props.match.params.bookingId]) 

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Typography component="h1" variant="h5">
            {editing? "Update a Book": "Book a slot"}
          </Typography>
          <TextField
            margin="normal"
            required
            id="nric"
            label="NRIC Number"
            name="nric"
            autoComplete="nric"
            fullWidth
            autoFocus
            value={state.nric}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={state.name}
            onChange={handleInputChange}
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            name="center"
            required
            fullWidth
            id="vaccineCenter"
            value={state.center}
            onChange={handleSelect}
          >
            {state.VaccineCenters.map((v) => {
              return <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>;
            })}
          </Select>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            label="Slot"
            value={state.date}
            onChange={handleDateChange}
            required
          />
          <Select
            name="slot_number"
            value={state.slot_number}
            onChange={(e) => handleTimeChange(e)}
            fullWidth
          >
            {state.slot_numbers.filter(item => item.avaiable).map((slot, index) => {
              return (<MenuItem key={slot.time} value={index} disabled={!slot.avaiable}>{slot.time}{slot.avaiable? "": " - this slot is full."}</MenuItem>);
            })}
            {state.slot_numbers.filter(item => item.avaiable).length == 0?(<MenuItem key={-1} value={-1} disabled={true}>No avaiable slot</MenuItem>): ""}
          </Select>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            spacing={1}
            color='primary'
          >
              {editing? "Save!": "Register!"}
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}
