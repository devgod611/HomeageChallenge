import './App.css';
import {Route, Switch,BrowserRouter } from 'react-router-dom';
import VaccineRegistration from './containers/VaccineRegistration/VaccineRegistration';
import VaccineRegistrationListing from './containers/VaccineRegistration/ListVaccinationBooking';
import CenterListing from './containers/CenterRegistration/CenterListing';
import { NavBar } from './containers/Nav';
import { Component } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ThemeProvider from './ThemeProvider';

class App extends Component {
  componentDidMount() {
    document.title = 'Vaccination Center';
  }
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <BrowserRouter>
            <NavBar />
            <Switch>
              <Route path="/" exact component={VaccineRegistration} />
              <Route path="/centers" exact component={CenterListing} />
              <Route path="/bookings" exact component={VaccineRegistrationListing} />
              <Route path="/bookings/:bookingId" exact component={VaccineRegistration} />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    )
  }
}


export default App;
