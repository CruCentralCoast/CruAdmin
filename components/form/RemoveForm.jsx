import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography, Button
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
    root: {
      minWidth: 250,
    },
    deleteButton: {
      marginLeft: 'auto',
      marginRight: 'auto',
      color: '#ffffff',
      backgroundColor: '#dd7d1b',
    },
    editButton: {
      marginLeft: 'auto',
      marginRight: 'auto',
      color: '#ffffff',
      backgroundColor: '#007398',
    },
    buttonGroup: {
      alignItems: 'center'
    },
    cardControl: {
      width: '18vw',
      height: '20vw',
      minWidth: 275,
    },
    formControl: {
      display: 'flex',
      flexDirection: 'row',
    }
  });

export default function RemoveForm(props) {

    const { open, cg, handleRem } = props;

    const [openRem, setOpenRem] = React.useState(false);

    useEffect(() => {
        console.log("Props Open is ", open);
        setOpenRem(open);
      }, [open]);

    return (
        <div>
            <Dialog open={openRem} onClose={() => handleRem(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Remove CG</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Are you sure you would like to permanently remove CG?
                    <br />
                    Led by {cg.leadersNamesString}
                </DialogContentText>

                </DialogContent>
                <DialogActions>
                <Button onClick={() => handleRem(true)} color="primary">
                    Yes
                </Button>
                <Button onClick={() => handleRem(false)} color="primary">
                    No
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}