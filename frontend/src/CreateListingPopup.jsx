import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { fileToDataUrl } from './helpers.js';

export default function CreateListingPopup (props) {
  const { listings, setListings } = props
  const [open, setOpen] = React.useState(false);
  const [bedroomInputFields, setBedroomInputFields] = useState([<TextField key={0}/>]);
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [numOfBath, setNumOfBath] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [amenities, setAmenities] = useState([])
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

  const handleBedroomDetailsChange = e => {
    e.preventDefault();
    const key = e.target.id;
    const numOfGuests = Number(e.target.value)
    const newObj = { [`${key}`]: numOfGuests }
    const copy = [...bedroomDetails]
    const idx = copy.findIndex((b) => Object.keys(b)[0] === key)
    if (idx > -1) {
      copy[`${key}`] = numOfGuests
      setBedroomDetails(copy)
    } else {
      copy.push(newObj)
      setBedroomDetails(copy)
    }
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
    e.preventDefault();
    console.log('input value: ', e.target.files[0])
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((image) => {
      setThumbnail(image)
    })
  };
  const handleAmenitiesChange = (e) => {
    const amenity = e.target.value
    const checked = e.target.checked
    if (checked) {
      const copy = [...amenities]
      copy.push(amenity)
      setAmenities(copy);
    } else {
      const copy = [...amenities]
      const idx = copy.findIndex((a) => a === amenity)
      copy.splice(idx, 1)
      setAmenities(copy);
    }
  }

  const handleSubmit = async () => {
    // TODO: fix amenities
    const addr = { addr: address }
    const metadata = { bedroomDetails, numOfBath, amenities, type }
    const payload = { title, address: addr, price, thumbnail, metadata }
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
      const copy = [...listings];
      copy.push(payload)
      console.log('copy after new listing added: ', copy)
      setListings(copy)
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
          <div>Thumbnail: <input onChange={handleThumbnailChange} type="file" /></div>
          <Divider />
          <div>amenities:
          <FormGroup>
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="Kitchen" value="Kitchen" />
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="Wi-Fi" value="Wi-Fi" />
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="Coffee maker" value="Coffee maker" />
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="BBQ grill" value="BBQ grill" />
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="Swimming pool" value="Swimming pool" />
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="TV" value="TV"/>
          </FormGroup>
          </div>
          <Divider />
          <div>
             Bedroom details:
            {bedroomInputFields.map((item, i) => {
              return (
                <TextField
                key={i}
                onChange={handleBedroomDetailsChange}
                autoFocus
                margin="dense"
                id={`bedroom${i + 1}`}
                label={`Number of beds in bedroom ${i + 1}`}
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
          <Button onClick={handleSubmit} >Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
