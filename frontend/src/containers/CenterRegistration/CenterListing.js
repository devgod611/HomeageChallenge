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
    Select,
    MenuItem
} from "@material-ui/core";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { Component } from "react";
import axios from 'axios';
import NurseRegisterModal from './NurseRegisterModal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { SERVER_URL } from '../../config/url';

const styles = theme => ({
    root: {
      '& .MuiTextField-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
      },
      '& .MuiSelect-root': {
        margin: theme.spacing(2),
        paddingBottom: theme.spacing(0)
      },
      '& .MuiButton-root': {
        marginTop: theme.spacing(3),
      }
    },
});

/**
 * center & nurse management component
 */
class CenterListing extends Component {
    constructor(props) {
      super(props);
      this.state = {
        nurses: [], // nurse list
        center: 0, // selected center
        VaccineCenters: [], // cneter list
        open: false, // state for nurse modal (open/close)
        openCalendar: false, // state for nurse workdays modal (open/close)
        nurse: {
            id: 0,
            name: 0
        }, // selected nurse
        dates: [], // workdays for selected nurse,
        totalNurse: 0 // nurse count for selected center
      };
    }

    componentDidMount() {
        // load centers
        fetch(SERVER_URL + "/centers")
          .then(response => response.json())
          .then(centers => {
              // load nurses for selected center.
              // if there are over 1 centers, choose first center as default.
              if(centers.length > 0) {
                  const first_center = centers[1].id;
                  this.fetchNurses((nurses) => {
                      this.setState({ ...this.state, VaccineCenters: centers, nurses: nurses, center: first_center, totalNurse: nurses.length });
                  }, first_center);
              }
        });
    }

    // this function returns nurses list for selected center. 
    // If you don't put a center on second param, a center in the component state will be chosen.
    fetchNurses = (callback, center = null) => {
        const center_id = center != null? center: this.state.center;
        if(center_id) {
            fetch(SERVER_URL + "/nurses/center/" + center_id)
            .then(response => response.json())
            .then(nurses => {
                callback(nurses)
            });
        }
        else callback([])
    }

    // center selector handler
    handleSelectCenter = (event) => {
        this.fetchNurses((nurses) => {
            this.setState({ ...this.state, nurses: nurses, center: event.target.value, totalNurse: nurses.length });
        }, event.target.value);
    }

    // delete a nurse
    handleDeleteNurse(event, id) {
        event.preventDefault();
    
        axios.delete(`${SERVER_URL}/nurses/` + id)
        .then(res => {
            this.fetchNurses((nurses) => {
                this.setState({ ...this.state, nurses: nurses, totalNurse: nurses.length });
            });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    // open the nurse modal
    handleNurseOpen = (nurse_id, nurse_name) => {
        if(nurse_id) {
            this.setState({...this.state, open: true, nurse: { id: nurse_id, name: nurse_name}});
        }
        else {
            this.setState({...this.state, open: true, nurse: { id: 0, name: ''}});
        }
    };

    // close the nurse modal
    handleNurseClose = () => {
        this.setState({...this.state, open: false});
    };

    // open the nurse workdays modal
    handleCalendarOpen = (nurse) => {
        fetch(SERVER_URL + "/nurse_workdays/" + nurse)
        .then(response => response.json())
        .then(res => {
            var dates = res.map(item => new Date(item.work_date));
            this.setState({...this.state, openCalendar: true, nurse: { id: nurse}, dates: dates});
        });
    };

    // close the nurse workdays modal
    handleCalendarClose = () => {
        this.setState({...this.state, openCalendar: false, nurse: { id: 0, name: ''}});
    };

    // when changing nurse name on nurse modal, it causes component nurse state.
    handleChangeNurseName = (nurse) => {
        this.setState({ ...this.state, nurse: nurse});
    }

    // create/update nurse. after it have done, reload nurse list.
    handleSaveNurse = () => {
        const payload = {...this.state.nurse, center: this.state.center};
        if(this.state.nurse.id) { // editing
            axios.put(`${SERVER_URL}/nurses/` + this.state.nurse.id, payload)
            .then(res => {
                this.handleNurseClose();
                this.fetchNurses((nurses) => {
                    this.setState({ ...this.state, nurses: nurses, nurse: { id: 0, name: ""}, totalNurse: nurses.length});
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        else {
            axios.post(`${SERVER_URL}/nurses`, payload)
            .then(res => {
                this.handleNurseClose();
                this.fetchNurses((nurses) => {
                    this.setState({ ...this.state, nurses: nurses, nurse: { id: 0, name: ""}, totalNurse: nurses.length});
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    // create/update workdays for selected nurse
    handleNurseWorkdaysSubmit = (dates) => {
        let data = dates.map(date => {
            return {
                work_date: date,
                nurse: this.state.nurse.id,
                center: this.state.center
            };
        })
        axios.post(`${SERVER_URL}/nurse_workdays/`  + this.state.nurse.id , data)
        .then(res => {
            this.setState({ ...this.state, openCalendar: false, nurse: { id: 0, name: ""} });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    render() {
      return (
        <React.Fragment>
          <CssBaseline />
          <Container>
            <NurseRegisterModal 
                open={this.state.open} 
                onClose={this.handleNurseClose} 
                onSaveNurse={this.handleSaveNurse}
                onChangeNurseName={this.handleChangeNurseName}
                nurse={this.state.nurse}
            />
            <Box sx={{mt: 8}}>
              <Typography component="h1" variant="h5">
                Center & Nurse Management
              </Typography>
              <Select
                label="Vaccine Center"
                required
                id="vaccineCenter"
                value={this.state.center}
                onChange={(e) => this.handleSelectCenter(e)}
                sx={{mb: 2}}
                style={{ "float": "left"}}
               >
                {this.state.VaccineCenters.map((v) => {
                    return <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>;
                })}
                </Select>
                <Typography component="h5" variant="h5" style={{ float: "right"}}>
                    Total Nurses In This Center: {this.state.totalNurse}
                </Typography>
                <TableContainer component={Box}>
                    <Table sx={{ width: '90%' }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Nurse Name</TableCell>
                            <TableCell align="left">
                                <Button onClick={(e) => this.handleNurseOpen()}>
                                    <AddCircleOutlineIcon/> Add a Nurse
                                </Button>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.nurses.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">
                                    <Button onClick={(e) => this.handleNurseOpen(row.id, row.name)}>
                                        <ModeEditIcon />
                                    </Button>
                                    <Button onClick={(e) => this.handleDeleteNurse(e, row.id)}>
                                        <DeleteIcon/>
                                    </Button>
                                    <Button onClick={(e) => this.handleCalendarOpen(row.id)}>
                                        <CalendarMonthIcon/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <MultipleDatesPicker
                    open={this.state.openCalendar}
                    selectedDates={this.state.dates}
                    onCancel={() => this.handleCalendarClose()}
                    onSubmit={dates => this.handleNurseWorkdaysSubmit(dates)}
                />
            </Box>
          </Container>
        </React.Fragment>
      );
    }
}
  

CenterListing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenterListing);