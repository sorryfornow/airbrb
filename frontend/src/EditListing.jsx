import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { fileToDataUrl } from './helpers.js';

const EditListing = (props) => {
  const { id } = useParams()
  const [listing, setListing] = useState()

  const [bedroomInputFields, setBedroomInputFields] = useState([<TextField key={0}/>]);
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [numOfBath, setNumOfBath] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [amenities, setAmenities] = useState([])
  const [bedroomDetails, setBedroomDetails] = useState([]);

  useEffect(() => {
    console.log('full listing: ', listing)
  }, [listing])

  useEffect(() => {
    async function getListing () {
      const reqData = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
      try {
        const fetchResponse = await fetch(`http://localhost:5005/listings/${id}`, reqData);
        const res = await fetchResponse.json();
        if (res) {
          setListing(res.listing)
          setTitle(res.listing.title)
        }
      } catch (e) {
        alert(e)
      }
    }
    getListing()
  }, [])

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

  const handleSave = async () => {
    console.log(title, address, price, type, numOfBath, thumbnail)
  };

  const handleCancel = async () => {
  };

  return (
    <React.Fragment>
        <div>Edit Listing</div>
        {listing && <div>
        <TextField
            autoFocus
            margin="dense"
            id="title"
            label="title"
            fullWidth
            variant="standard"
            value={title}
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
        </div>}
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} >Save</Button>
    </React.Fragment>
  )
}
export default EditListing
