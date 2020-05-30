import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent,
 DialogContentText, DialogTitle } from '@material-ui/core';

/* This component is the form to interact with 
   REMOVING data. Will be used by ALL REMOVALS
   in the future.
*/
export default function RemoveForm(props) {
    const { open, cg, handleRem, removeCallback } = props;
    const [openRem, setOpenRem] = React.useState(false);

    useEffect(() => {
        setOpenRem(open);
      }, [open]);
    
    const handleDelete = () => {
        removeCallback(cg.id);
        handleRem(false);
    }

    return (
        <div>
            <Dialog open={openRem} onClose={() => handleRem(false)}>
                <DialogTitle>Remove CG</DialogTitle>
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