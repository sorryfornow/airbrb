import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function CreateListingPopup () {
  const [open, setOpen] = React.useState(false);
  const [bedroomInputFields, setBedroomInputFields] = useState([<TextField key={0}/>]);
  const [, setBedroomDetails] = useState([]);

  //  reference: https://stackoverflow.com/questions/66469913/how-to-add-input-field-dynamically-when-user-click-on-button-in-react-js
  const addInput = () => {
    setBedroomInputFields(s => {
      return [
        ...s,
        <TextField
        key={bedroomInputFields.length}
    />
      ];
    });
  };
  const deleteInput = () => {
    setBedroomInputFields(s => {
      s.splice(-1)
      return [
        ...s
      ];
    });
  };

  const handleChange = e => {
    e.preventDefault();
    const key = e.target.id;
    const numOfGuests = e.target.value
    const newObj = { [`${key}`]: numOfGuests }

    console.log('key, numOfGuests', key, numOfGuests)
    setBedroomDetails(s => {
      const idx = s.findIndex((b) => Object.keys(b)[0] === key)
      if (idx > -1) {
        s.splice(idx, 1)
        s.push(newObj)
        console.log('edited existing: ', s)
        return [
          ...s
        ];
      } else {
        s.push(newObj)
        return [
          ...s
        ];
      }
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
      <Button variant="contained" onClick={handleClickOpen}>
        Create New Listing
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Listing</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              id="title"
              label="title"
              fullWidth
              variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="address"
              label="address"
              fullWidth
              variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Price per night"
              fullWidth
              variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="property-type"
              label="Property Type"
              fullWidth
              variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="number-of-bathrooms"
              label="Number of bathrooms"
              fullWidth
              variant="standard"
          />
          <div>
       Bedroom details:
      {bedroomInputFields.map((item, i) => {
        return (
          <TextField
          key={i}
          onChange={handleChange}
          autoFocus
          margin="dense"
          id={`bedroom${i + 1}`}
          label={`Max # of guests in bedroom ${i + 1}`}
          fullWidth
          variant="standard"
      />
        );
      })}
          <Button variant="contained" onClick={deleteInput}>-</Button>
          <Button variant="contained" onClick={addInput}>+</Button>
    </div>
          <TextField
              autoFocus
              margin="dense"
              id="property-amenities"
              label="Property amenities"
              fullWidth
              variant="standard"
          />
          <div>Thumbnail: <input type="file" /></div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
