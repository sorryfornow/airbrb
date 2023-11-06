import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Listing (props) {
  const { data } = props
  const navigate = useNavigate();
  const handleBook = () => {
    console.log('data EDIT: ', data)
    navigate(`/${data.id}`, { replace: true });
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
          Reviews: {data.reviews.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleBook} size="small" variant="contained">View</Button>
      </CardActions>
    </Card>
  );
}
