import React, { useState, useEffect } from 'react';
import { apiCall } from './helpers';
import { useParams } from 'react-router-dom'; // Import useParams hook to get listing id from URL
import { Card, CardMedia, CardContent, Typography, Grid, Box, Chip } from '@mui/material';

export default function Listing (props) {
  // Get listing id from props
  const { id } = useParams();
  const lstId = id;
  console.log('lstId:', lstId);
  const jwtToken = localStorage.getItem('jwtToken');

  // State to store listing details
  const [listWithDetails, setListWithDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiCall(`listings/${lstId}`, null, jwtToken, 'GET');
        if (!response || !response.listing) {
          setError('Failed to fetch listing details');
          return;
        }
        console.log('response:', response);
        setListWithDetails(response.listing);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Error occurred while fetching listing details');
      }
    };

    fetchDetails();
  }, [lstId, jwtToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listWithDetails) {
    return <div>Loading...</div>;
  }

  const { title, owner, address, price, thumbnail, metadata, reviews, availability, published, postedOn } = listWithDetails;
  // const { bedroomDetails, numOfBath, amenities, type, images } = metadata;
  console.log('listWithDetails:', listWithDetails);
  // display all data from listWithDetails
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ maxWidth: 345, m: 2 }}>
          <CardMedia
            component="img"
            height="140"
            image={thumbnail}
            alt={title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {address.street}, {address.city}, {address.state}, {address.postcode}, {address.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Owner: {owner}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: ${price} per night
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {metadata.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bedrooms: {metadata.bedroomDetails.map(bedroom => Object.keys(bedroom).map(key => `${key}: ${bedroom[key]} beds`)).join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bathrooms: {metadata.numOfBath}
            </Typography>
            <Box sx={{ my: 2 }}>
              {metadata.amenities.map((amenity, index) => (
                <Chip key={index} label={amenity} variant="outlined" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Reviews: {reviews.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Availability: {availability.map(a => `${new Date(a.start).toLocaleDateString()} to ${new Date(a.end).toLocaleDateString()}`).join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published: {published ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posted On: {new Date(postedOn).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Optional: Image Gallery or Carousel for `metadata.images` */}
      {/* Additional layout and content as needed */}
    </Grid>
  );
}
