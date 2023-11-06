import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { fileToDataUrl } from './helpers.js';

const EditListing = (props) => {
  const { id } = useParams()
  const [listing, setListing] = useState({})
  const navigate = useNavigate();

  const [bedroomInputFields, setBedroomInputFields] = useState([<TextField key={0}/>]);
  const [imgInputFields, setImgInputFields] = useState([]);
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [numOfBath, setNumOfBath] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [images, setImages] = useState([])
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
          const l = res.listing
          setTitle(l.title || 'unkown')
          setAddress(l.address.addr || 'unkown')
          setPrice(l.price || 'unkown')
          setType(l.metadata.type || 'unkown')
          setNumOfBath(l.metadata.numOfBath || 'unkown')
          setThumbnail(l.thumbnail || 'unkown')
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

  const handleThumbnailChange = (e) => {
    e.preventDefault();
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((image) => {
      setThumbnail(image)
    })
  };

  const handleImagesChange = (e) => {
    e.preventDefault();
    console.log('hi images change')
    console.log('IMG CHANGE e.target.key', e.target.id)
    console.log('input value: ', e.target.files[0])
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((res) => {
      const uploadedImg = { id: Number(e.target.id), img: res }
      const copy = [...images];
      const existingImg = copy.find((i) => i.id === uploadedImg.id)
      if (existingImg) {
        existingImg.img = uploadedImg.img
        setImages(copy)
      } else {
        const copy = [...images];
        copy.push(uploadedImg)
        setImages(copy)
      }
    })
  };

  const addImgInput = () => {
    setImgInputFields(s => {
      return [
        ...s,
        <input onChange={handleImagesChange} type="file" key={imgInputFields.length}/>
      ];
    });
  };
  const deleteImgInput = () => {
    setImgInputFields(s => {
      s.splice(-1)
      return [
        ...s
      ];
    });

    const copy = [...images]
    copy.pop();
    setImages(copy);
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
  const onPriceChange = (e) => setPrice(e.target.value);
  const onTypeChange = (e) => setType(e.target.value);
  const onNumOfBathChange = (e) => setNumOfBath(e.target.value);
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
    if (isNaN(Number(price))) { alert('invalid price, please enter a valid number'); return }
    const addr = { addr: address }
    const metadata = { bedroomDetails, numOfBath, amenities, type, images }
    const payload = { title, address: addr, price: Number(price), thumbnail, metadata }
    console.log('payload: ', payload)

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
      const fetchResponse = await fetch(`http://localhost:5005/listings/${id}`, reqData);
      const data = await fetchResponse.json();
      console.log('edit listing res: ', data)
      navigate('/mylistings/', { replace: true });
    } catch (e) {
      alert(e)
    }
  };

  const handleCancel = () => {
    navigate('/mylistings/', { replace: true });
  };

  const handleDelete = () => {
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
            data-shrink={true}
        />
        <TextField
            autoFocus
            margin="dense"
            id="address"
            label="address"
            fullWidth
            variant="standard"
            value={address}
            onChange={onAddressChange}
            data-shrink={true}
        />
        <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price per night"
            fullWidth
            variant="standard"
            onChange={onPriceChange}
            value={price}
            data-shrink={true}

        />
        <TextField
            autoFocus
            margin="dense"
            id="property-type"
            label="Property Type"
            fullWidth
            variant="standard"
            onChange={onTypeChange}
            value={type}
            data-shrink={true}
        />
        <TextField
            autoFocus
            margin="dense"
            id="number-of-bathrooms"
            label="Number of bathrooms"
            fullWidth
            variant="standard"
            onChange={onNumOfBathChange}
            value={numOfBath}
            data-shrink={true}
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
        <div>List of Images: {imgInputFields.map((item, i) => { return (<input key={i} id={i} onChange={handleImagesChange} type="file" />) }) }
               <Button variant="contained" onClick={deleteImgInput}>-</Button>
              <Button variant="contained" onClick={addImgInput}>+</Button>
        </div>
        </div>}
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="success">Save</Button>
        <Button onClick={handleDelete} variant="contained" color="error" >Delete listing</Button>
    </React.Fragment>
  )
}
export default EditListing