import { Link } from 'react-router-dom';
import React from "react";
import { Tabs, Tab } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { setTab } from '../../reducers/navigation';

export const NavBar = () => {
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    dispatch(setTab(newValue));
  };
  const tab = useSelector((state) => state.navigation.tab)
  console.log(tab)
  return (
    <Tabs value={tab} onChange={handleChange} centered>
      <Tab component={Link} to="/" label="Make a Booking" value="/" />
      <Tab component={Link} to="/bookings" label="All Booking" value="/bookings" />
      <Tab component={Link} to="/centers" label="Center Management" value="/centers" />
    </Tabs>
  );
};