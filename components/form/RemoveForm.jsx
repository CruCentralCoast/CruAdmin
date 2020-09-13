import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent,
 DialogContentText, DialogTitle } from '@material-ui/core';

/* This component is the form to interact with 
   REMOVING data. Will be used by ALL REMOVALS
   in the future.
*/
export default function RemoveForm(props) {
    const { open, id, handleRemove, removeCallback, item, removalText } = props;
    const [openRemove, setOpenRemove] = React.useState(false);

    useEffect(() => {
        setOpenRemove(open);
      }, [open]);
    
    const handleDelete = () => {
        removeCallback(id);
        handleRemove(false);
    }

    return (
        <div>
            <Dialog open={openRemove} onClose={() => handleRemove(false)}>
                <DialogTitle>Remove {item}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {removalText}
                </DialogContentText>

                </DialogContent>
                <DialogActions>
                <Button onClick={handleDelete} color="primary">
                    Yes
                </Button>
                <Button onClick={() => handleRemove(false)} color="primary">
                    No
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}