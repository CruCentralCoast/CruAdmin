import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/* This component is the form to interact with 
   REMOVING data. Will be used by all REMOVALS
   in the future.
*/
export default function RemoveForm(props) {
    const { open, cg, handleRem, removeCallback } = props;
    const [openRem, setOpenRem] = React.useState(false);

    useEffect(() => {
        setOpenRem(open);
      }, [open]);

    const handleDelete = () => {
        // verify?
        removeCallback(cg.id);
        handleRem(false);
    }

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
                <Button onClick={handleDelete} color="primary">
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