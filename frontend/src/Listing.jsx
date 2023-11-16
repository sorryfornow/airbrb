import React, { useState, useEffect } from 'react';
import { apiCall } from './helpers';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Grid, Box, Chip, TextField, Button, } from '@mui/material';
import DateSelector from './DateSelector';
import dayjs from 'dayjs';

export default function Listing (props) {
  // Get listing id from url and token from localStorage
  const { id } = useParams();
  const lstId = id;
  const jwtToken = localStorage.getItem('jwtToken');
  const userEmail = localStorage.getItem('userEmail');
  // States for booking and review form
  const [dates, setDates] = useState([{ id: 'searchDateBooking', start: null, end: null }]);
  const [reviewScore, setReviewScore] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isBookingRequested, setIsBookingRequested] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [ableToReview, setAbleToReview] = useState(false);
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

    const fetchBookingStatus = async () => {
      try {
        const { bookings } = await apiCall('bookings', null, jwtToken, 'GET');

        if (bookings && Array.isArray(bookings)) {
          const curUserBooking = bookings.filter(booking => booking.owner === userEmail && booking.listingId === lstId);
          console.log('curUserBooking:', curUserBooking); // Debugging log
          setUserBookings(curUserBooking);
          // Check if any booking is accepted
          const acceptedBooking = curUserBooking.find(booking => booking.status === 'accepted');
          console.log('acceptedBooking:', acceptedBooking); // Debugging log
          if (acceptedBooking && acceptedBooking.length > 0) setAbleToReview(true);
        } else {
          // Handle unexpected response format
          console.error('Unexpected response format:', bookings);
        }
      } catch (err) {
        console.error('Error fetching booking status:', err);
      }
    };

    fetchDetails();
    if (jwtToken && userEmail) fetchBookingStatus();
  }, [lstId, jwtToken, userEmail]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listWithDetails) {
    return <div>Loading...</div>;
  }

  // Function to handle booking submission
  const handleBooking = async () => {
    try {
      const bookingDate = dates.find(dt => dt.id === 'searchDateBooking');
      // reformat dateRange to match the format in the database
      const dateRange = { startDate: dayjs(bookingDate.start).format('YYYY-MM-DD'), endDate: dayjs(bookingDate.end).format('YYYY-MM-DD') };
      const totalPrice = listWithDetails.price * dayjs(bookingDate.end).diff(dayjs(bookingDate.start), 'day');
      // const bookingDetails = { dateRange: dateRange, totalPrice: totalPrice };
      const bookingDetails = { dateRange, totalPrice };
      const response = await apiCall(`bookings/new/${lstId}`, bookingDetails, jwtToken, 'POST');
      if (response) {
        console.log('Booking Success:', response);
        setIsBookingRequested('Your booking request has been sent and is awaiting approval.');
      } else {
        console.error('Booking Failed:', response);
        setIsBookingRequested('Failed to make a booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      setIsBookingRequested('An error occurred while making the booking.');
    }
  };

  // Function to handle review submission
  const handleReviewSubmit = async () => {
    // Implement review submission logic
    try {
      const review = { score: reviewScore, comment: reviewComment };
      const response = await apiCall(`listings/${lstId}/review/{bookingid}`, review, jwtToken, 'POST');
      if (response) {
        console.log('Review Success:', response);
        setReviewScore('');
        setReviewComment('');
      } else {
        console.error('Review Failed:', response);
      }
    } catch (error) {
      console.error('Review Error:', error);
    }
  };

  // Display booking status if available
  const displayBookingStatus = () => {
    return userBookings.map((booking, index) => (
      <Box key={index} mb={2}>
        <Typography variant="body2">Start Date: {booking.dateRange.startDate}</Typography>
        <Typography variant="body2">End Date: {booking.dateRange.endDate}</Typography>
        <Typography variant="body2">Total Price: {booking.totalPrice}</Typography>
        <Typography variant="body2">Status: {booking.status}</Typography>
      </Box>
    ));
  };

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
      {/* TODO: Image Gallery or Carousel for `metadata.images` */}
      {/* Booking and Review part */}
      {jwtToken && (
        <Grid item xs={12} md={6}>
          {/* Booking form */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>Book Your Stay</Typography>
            <DateSelector id="searchDateBooking" dates={dates} setDates={setDates} />
            <Button variant="contained" onClick={handleBooking} sx={{ mt: 1 }}>
              Book Now
            </Button>
            {isBookingRequested && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{isBookingRequested}</Typography>}
          </Box>

          {/* Review form */}
          {ableToReview && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>Leave a Review</Typography>
              <TextField
                label="Review Score"
                type="number"
                value={reviewScore}
                onChange={(e) => setReviewScore(e.target.value)}
                sx={{ mb: 1, width: '100%' }}
                inputProps={{ min: "1", max: "5", step: "1" }} // Set min and max values
              />
              <TextField
                label="Comment"
                multiline
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                sx={{ mb: 1, width: '100%' }}
              />
              <Button variant="contained" onClick={handleReviewSubmit}>
                Submit Review
              </Button>
            </Box>
          )}
          {/* Display booking status */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>Booking Status</Typography>
            {displayBookingStatus()}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
