import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateSelector from './DateSelector';
export default function PublishListingPopup () {
  const [open, setOpen] = useState(false);
  const [dateSelectorFields, setDateSelectorFields] = useState([<DateSelector key={0}/>]);

  const addInput = () => {
    setDateSelectorFields(s => {
      return [
        ...s,
        <DateSelector
        key={dateSelectorFields.length}
       />
      ];
    });
  };
  const deleteInput = () => {
    setDateSelectorFields(s => {
      s.splice(-1)
      return [
        ...s
      ];
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Publish
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Availability</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter available dates:
          </DialogContentText>
          {dateSelectorFields.map((d, i) => <DateSelector key={i}/>
          )}
         <Button variant="contained" onClick={deleteInput}>-</Button>
         <Button variant="contained" onClick={addInput}>+</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
