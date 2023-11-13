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
import PropertyType from './PropertyType.jsx';

export default function CreateListingPopup (props) {
  const { allListings, setAllListings } = props
  const [open, setOpen] = React.useState(false);
  const [bedroomInputFields, setBedroomInputFields] = useState([]);
  const [title, setTitle] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [numOfBath, setNumOfBath] = useState('')
  const [thumbnail, setThumbnail] = useState()
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
    const copy = [...bedroomDetails]
    const newbd = { [`bedroom${bedroomDetails.length + 1}`]: undefined }
    copy.push(newbd)
    setBedroomDetails(copy)
  };
  const deleteInput = () => {
    setBedroomInputFields(s => {
      s.splice(-1)
      return [
        ...s
      ];
    });
    const copy = [...bedroomDetails]
    copy.pop();
    setBedroomDetails(copy);
  };

  const handleBedroomDetailsChange = e => {
    e.preventDefault();
    const key = e.target.id;
    const numOfGuests = Number(e.target.value)
    const copy = [...bedroomDetails]

    const obj = copy.find((b) => { if (Object.keys(b)[0] === key) { return b } else { return undefined } })
    if (obj) {
      obj[`${key}`] = numOfGuests
      setBedroomDetails(copy)
    } else {
      alert('fail to update room info')
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onTitleChange = (e) => setTitle(e.target.value);
  const onStreetAddressChange = (e) => setStreetAddress(e.target.value);
  const onCityChange = (e) => setCity(e.target.value);
  const onPriceChange = (e) => setPrice(Number(e.target.value));
  const onNumOfBathChange = (e) => setNumOfBath(e.target.value);
  const handleThumbnailChange = (e) => {
    e.preventDefault();
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
    // validation
    if (title === '') { alert('invalid title'); return }
    if (streetAddress === '') { alert('invalid street address'); return }
    if (city === '') { alert('invalid city'); return }
    if (type === '') { alert('invalid property type'); return }
    if (isNaN(Number(price))) { alert('invalid price, please enter a valid number'); return }
    if (!thumbnail) { alert('must provide a thumbnail'); return }
    for (let i = 0; i < bedroomDetails.length; i++) {
      if (isNaN(bedroomDetails[i][`bedroom${i + 1}`])) { alert(`invalid bed number for bedroom${i + 1}`); return }
    }
    if (type === '') { alert('invalid property type'); return }
    const addr = { addr: streetAddress, city }
    const metadata = { bedroomDetails, numOfBath, amenities, type }
    const payload = { title, address: addr, price, thumbnail, metadata, reviews: [] }
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
      const copy = [...allListings];
      console.log('copy before: ', copy)
      payload.id = Number(data.listingId)
      payload.owner = localStorage.getItem('userEmail')
      console.log('copy payload: ', payload)
      copy.push(payload)
      console.log('copy after: ', copy)
      setAllListings(copy)
    } catch (e) {
      alert(e)
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen} data-cy='create-new-listing-button'>
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
              id="street address"
              label="Street address"
              fullWidth
              variant="standard"
              onChange={onStreetAddressChange}
              data-cy='create-listing-street-address'

          />
          <TextField
              autoFocus
              margin="dense"
              id="city"
              label="City"
              fullWidth
              variant="standard"
              onChange={onCityChange}

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
          <PropertyType type={type} setType={setType}/>
          <TextField
              autoFocus
              margin="dense"
              id="number-of-bathrooms"
              label="Number of bathrooms"
              fullWidth
              variant="standard"
              onChange={onNumOfBathChange}

          />
          <div>Thumbnail: <input onChange={handleThumbnailChange} type="file" data-cy='create-listing-thumbnail-input' /></div>
          <Divider />
          <div>amenities:
          <FormGroup>
            <FormControlLabel onChange={handleAmenitiesChange} control={<Checkbox />} label="Kitchen" value="Kitchen" data-cy='create-listing-checkbox-kitchen'/>
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
                data-cy={`bedroom-input-${i}`}
            />
              );
            })}
                <Button variant="contained" onClick={deleteInput}>-</Button>
                <Button variant="contained" onClick={addInput} data-cy='create-listing-bedroom-add'>+</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} data-cy='create-listing-button-create'>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
