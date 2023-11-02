import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fileToDataUrl } from './helpers.js';

export default function CreateListingPopup () {
  const [open, setOpen] = React.useState(false);
  const [bedroomInputFields, setBedroomInputFields] = useState([<TextField key={0}/>]);
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [numOfBath, setNumOfBath] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [bedroomDetails, setBedroomDetails] = useState([]);

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
    const numOfGuests = Number(e.target.value)
    const newObj = { [`${key}`]: numOfGuests }

    console.log('key, numOfGuests', key, numOfGuests)
    console.log('curr obj', bedroomDetails)

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

  const onTitleChange = (e) => setTitle(e.target.value);
  const onAddressChange = (e) => setAddress(e.target.value);
  const onPriceChange = (e) => setPrice(Number(e.target.value));
  const onTypeChange = (e) => setType(e.target.value);
  const onNumOfBathChange = (e) => setNumOfBath(e.target.value);
  const handleThumbnailChange = (e) => {
    console.log('input value: ', e.target.files[0])
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((image) => {
      setThumbnail(image)
    })
  };

  const handleSubmit = async () => {
    // TODO: fix amenities
    const metadata = { bedroomDetails, numOfBath, amenities: [] }
    const payload = { title, address, price, type, thumbnail, metadata }
    console.log('payload: ', payload)

    const jwtToken = localStorage.getItem('jwtToken');

    const reqData = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
    try {
      const fetchResponse = await fetch('http://localhost:5005/listings/new', reqData);
      const data = await fetchResponse.json();
      console.log('create listing res: ', data)
    } catch (e) {
      alert(e)
    }

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
              onChange={onTitleChange}
          />
          <TextField
              autoFocus
              margin="dense"
              id="address"
              label="address"
              fullWidth
              variant="standard"
              onChange={onAddressChange}

          />
          <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Price per night"
              fullWidth
              variant="standard"
              onChange={onPriceChange}

          />
          <TextField
              autoFocus
              margin="dense"
              id="property-type"
              label="Property Type"
              fullWidth
              variant="standard"
              onChange={onTypeChange}

          />
          <TextField
              autoFocus
              margin="dense"
              id="number-of-bathrooms"
              label="Number of bathrooms"
              fullWidth
              variant="standard"
              onChange={onNumOfBathChange}

          />
          <TextField
              autoFocus
              margin="dense"
              id="property-amenities"
              label="Property amenities"
              fullWidth
              variant="standard"
          />
          <div>Thumbnail: <input onChange={handleThumbnailChange} type="file" /></div>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} >Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
