import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import PublishListingPopup from './PublishListingPopup';

export default function MyListingCard (props) {
  const { data } = props
  const bedrooomDetails = data.metadata.bedroomDetails
  let numOfBeds = 0
  if (bedrooomDetails && bedrooomDetails.length > 0) {
    // const bedInfo = Object.values(bedrooomDetails)
    const bedsArr = []
    bedrooomDetails.forEach((b) => bedsArr.push(Object.values(b)))
    const bedNumArr = bedsArr.flat()
    for (let i = 0; i < bedNumArr.length; i++) { numOfBeds += bedNumArr[i] }
  }
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/mylistings/${data.id}`, { replace: true });
  };
  return (
    <Card sx={{ width: 345 }}>
      <CardMedia
        sx={{ height: 300 }}
        image={data.thumbnail || require('./house_icon_1.png')}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title || 'no title'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.address.addr}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {data.metadata.type || 'unkown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of beds: {numOfBeds || 'unkown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of reviews: {data.reviews.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {data.price || 'unkown'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleEdit} size="small">Edit</Button>
        <PublishListingPopup listingID={data.id}/>
      </CardActions>
    </Card>
  );
}
