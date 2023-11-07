import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { fileToDataUrl } from './helpers.js';
import PropertyType from './PropertyType.jsx';
import styles from './EditListing.module.css'

const EditListing = (props) => {
  const { allListings, setAllListings } = props
  const { id } = useParams()
  const [listing, setListing] = useState({})
  const navigate = useNavigate();

  const [bedroomInputFields, setBedroomInputFields] = useState([]);
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
    // console.log('full listing: ', listing)
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
          setNumOfBath(l.metadata.numOfBath || 'unknown')
          setThumbnail(l.thumbnail || 'unkown')
          if (l.metadata.images) setImages(l.metadata.images)
          setBedroomDetails(l.metadata.bedroomDetails)

          const initialImages = l.metadata.images
          if (initialImages && initialImages.length > 0) {
            const initialImageInputs = []
            for (let i = 0; i < initialImages.length; i++) {
              const currImgInput = <input type="file" key={i}/>
              initialImageInputs.push(currImgInput)
            }
            setImgInputFields(initialImageInputs)
          }

          const initialBedroomDetails = l.metadata.bedroomDetails
          if (initialBedroomDetails && initialBedroomDetails.length) {
            const initialBedroomInputs = []
            for (let i = 0; i < initialBedroomDetails.length; i++) {
              const currbdInput = <TextField key={i}/>
              initialBedroomInputs.push(currbdInput)
            }
            setBedroomInputFields(initialBedroomInputs)
          }
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

  const handleThumbnailChange = (e) => {
    e.preventDefault();
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((image) => {
      setThumbnail(image)
    })
  };

  const handleImagesChange = (e) => {
    e.preventDefault();
    // console.log('hi images change')
    // console.log('IMG CHANGE e.target.key', e.target.id)
    // console.log('input value: ', e.target.files[0])
    const filePromise = fileToDataUrl(e.target.files[0])
    filePromise.then((res) => {
      const uploadedImg = { id: Number(e.target.id), img: res }
      const copy = [...images];
      const existingImg = copy.find((i) => i.id === uploadedImg.id)
      // existingImg should always be defined as the obj is created when img file input is created
      if (existingImg) {
        existingImg.img = uploadedImg.img
        setImages(copy)
      } else {
        alert('failed to uplaod image')
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

    const copy = [...images]
    const newImg = { id: images.length, img: undefined }
    copy.push(newImg)
    setImages(copy)
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
    console.log('key: ', key)
    const numOfGuests = Number(e.target.value)
    const copy = [...bedroomDetails]
    console.log('copy 1: ', copy)

    const obj = copy.find((b) => { if (Object.keys(b)[0] === key) { return b } else { return undefined } })
    console.log('obj: ', obj)
    if (obj) {
      obj[`${key}`] = numOfGuests
      console.log('copy bd: ', copy)
      setBedroomDetails(copy)
    } else {
      alert('fail to update room info')
    }
  };

  const onTitleChange = (e) => setTitle(e.target.value);
  const onAddressChange = (e) => setAddress(e.target.value);
  const onPriceChange = (e) => setPrice(e.target.value);
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

      navigate('/mylistings/');
    } catch (e) {
      alert(e)
    }
  };

  const handleCancel = () => {
    navigate('/mylistings/', { replace: true });
  };

  const handleDelete = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const reqData = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
    try {
      const fetchResponse = await fetch(`http://localhost:5005/listings/${id}`, reqData);
      const res = await fetchResponse.json();
      if (res) {
        console.log('delete listing res: ', res)
        const copy = [...allListings]
        const idx = copy.findIndex((l) => Number(l.id) === Number(id))
        copy.splice(idx, 1)
        setAllListings(copy)
        navigate('/mylistings/');
      }
    } catch (e) {
      alert(e)
    }
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
        <PropertyType type={type} setType={setType}/>

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
        <div>Thumbnail:
          <CardMedia
           sx={{ height: 50, width: 50 }}
           image={thumbnail || require('./house_icon_1.png')}
          />
          <input onChange={handleThumbnailChange} type="file" /></div>
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
          {bedroomInputFields.length > 0 && bedroomInputFields.map((item, i) => {
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
              value={bedroomDetails[i][`bedroom${i + 1}`] || ''}
          />
            );
          })}
              <Button variant="contained" size="small" onClick={deleteInput}>-</Button>
              <Button variant="contained" size="small" onClick={addInput}>+</Button>
        </div>
        <div className={styles.listOfImages}>
            List of Images:
              {imgInputFields.length > 0 && imgInputFields.map((item, i) => {
                return (
                <div key={i}>
                   <CardMedia
                    sx={{ height: 50, width: 50 }}
                    image={images[i].img || require('./upload-icon.png')}
                   />
                  <input key={i} id={i} onChange={handleImagesChange} type="file" />
                </div>)
              }) }
              <div>
              <Button variant="contained" size="small" onClick={deleteImgInput}>-</Button>
              <Button variant="contained" size="small" onClick={addImgInput}>+</Button>
              </div>

        </div>
        </div>}
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="success">Save</Button>
        <Button onClick={handleDelete} variant="contained" color="error" >Delete listing</Button>
    </React.Fragment>
  )
}
export default EditListing
