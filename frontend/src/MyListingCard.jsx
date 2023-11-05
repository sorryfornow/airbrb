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
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/mylistings/${data.id}`, { replace: true });
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 300 }}
        image={data.thumbnail || require('./house_icon_1.png')}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.address.addr}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleEdit} size="small">Edit</Button>
        <PublishListingPopup listingID={data.id}/>
        <Button size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}
