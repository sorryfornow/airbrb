import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateSelector from './DateSelector';
export default function PublishListingPopup (props) {
  const { listingID } = props
  const [open, setOpen] = useState(false);
  const [dateSelectorFields, setDateSelectorFields] = useState([<DateSelector key={0} id={0}/>]);
  const [dates, setDates] = useState([{ id: 0, start: '', end: '' }])
  const addInput = () => {
    setDateSelectorFields(s => {
      return [
        ...s,
        <DateSelector
        key={dateSelectorFields.length}
       />
      ];
    });
    const copy = [...dates];
    copy.push({ id: dates.length, start: '', end: '' });
    setDates(copy);
  };
  const deleteInput = () => {
    setDateSelectorFields(s => {
      s.splice(-1)
      return [
        ...s
      ];
    });
    const copy = [...dates];
    copy.pop();
    setDates(copy);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePublish = async () => {
    const payload = { availability: dates }
    console.log('dates: ', dates)
    const jwtToken = localStorage.getItem('jwtToken');
    const reqData = {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
    try {
      const fetchResponse = await fetch(`http://localhost:5005/listings/publish/${listingID}`, reqData);
      const data = await fetchResponse.json();
      console.log('publish listing res: ', data)
    } catch (e) {
      alert(e)
    }
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
          {dateSelectorFields.map((d, i) => <DateSelector key={i} id={i} dates={dates} setDates={setDates}/>
          )}
         <Button variant="contained" onClick={deleteInput}>-</Button>
         <Button variant="contained" onClick={addInput}>+</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePublish}>Publish</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
