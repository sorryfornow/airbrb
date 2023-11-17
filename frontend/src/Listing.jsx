import React, { useState, useEffect } from 'react';
import { apiCall } from './helpers';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Grid, Box, Chip, TextField, Button, } from '@mui/material';
import DateSelector from './DateSelector';
import dayjs from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import StarRateIcon from '@mui/icons-material/StarRate';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';

export default function Listing (props) {
  // Get listing id from url and token from localStorage
  const { id } = useParams();
  const lstId = id;
  const jwtToken = localStorage.getItem('jwtToken');
  const userEmail = localStorage.getItem('userEmail');
  // States for booking and review form
  const [dates, setDates] = useState([{ id: 'searchDateBooking', start: null, end: null }]);
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isBookingRequested, setIsBookingRequested] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [ableToReview, setAbleToReview] = useState(false);
  const [anyBookingid, setAnyBookingid] = useState(null);
  const [newReview, setNewReview] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  // const [newReview, setNewReview] = useState(null);
  // State to store listing details
  const [listWithDetails, setListWithDetails] = useState(null);
  const [error, setError] = useState(null);
  const fetchDetails = async () => {
    try {
      const response = await apiCall(`listings/${lstId}`, null, jwtToken, 'GET');
      if (!response || !response.listing) {
        setError('Failed to fetch listing details');
      } else {
        console.log('response:', response);
        setListWithDetails(response.listing);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Error occurred while fetching listing details');
    }
  };

  useEffect(() => {
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
          if (acceptedBooking) {
            setAbleToReview(true);
          }
          if (acceptedBooking) {
            setAnyBookingid(acceptedBooking.id);
          }
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
  }, [lstId, jwtToken, userEmail, ableToReview, newReview, anyBookingid, isBookingRequested]);

  if (error) {
    return <div>Error: {error} <button onClick={fetchDetails}>Retry</button></div>;
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
      const reviewData = { review: { author: userEmail, score: reviewScore, comment: reviewComment } };
      // Ensure review fields are not empty
      if (!reviewScore || !reviewComment.trim()) {
        alert('Please fill in all review fields');
        return;
      }
      const response = await apiCall(`listings/${lstId}/review/${anyBookingid}`, reviewData, jwtToken, 'PUT');
      if (response.error) {
        console.error('Review Failed:', response);
      } else {
        console.log('Review Success:', response);
        // set const review as newReview
        setNewReview('Your review has been submitted.');
        setReviewScore('');
        setReviewComment('');
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
  // Display reviews if available
  const displayReviews = () => {
    return listWithDetails.reviews.map((review, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {review.author}: {review.score}
        </Typography>
        <Typography variant="body2">
          {review.comment}
        </Typography>
      </Box>
    ));
  };

  const calculateRatingsBreakdown = (reviews) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      const score = parseInt(review.score, 10);
      if (breakdown[score] !== undefined) {
        breakdown[score] += 1;
      }
    });
    return breakdown;
  };

  const RatingStar = ({ value }) => {
    const count = ratingsBreakdown[value];
    const percentage = totalRatings > 0 ? ((count / totalRatings) * 100).toFixed(1) : 0;

    return (
      <Tooltip title={`${count} ratings (${percentage}%)`}>
        <StarRateIcon
          onMouseEnter={() => { /* logic to handle hover */ }}
          onClick={() => handleStarClick(value)}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>
    );
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const ratingsBreakdown = calculateRatingsBreakdown(listWithDetails.reviews);
  const totalRatings = listWithDetails.reviews.length;
  const transferYouTubeURL = (url) => {
    // transform regular YouTube URL to embed URL "https://www.youtube.com/watch?v=xyz" to "https://www.youtube.com/embed/xyz"
    const regExp = /^.*(youtu.be\/|v\/|u\/w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };
  const { title, owner, address, price, thumbnail, metadata, reviews, availability, published, postedOn } = listWithDetails;
  // const { bedroomDetails, numOfBath, amenities, type, images } = metadata;
  console.log('listWithDetails:', listWithDetails);
  // display all data from listWithDetails
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ maxWidth: 345, m: 2 }}>
          {/* <CardMedia
            component="img"
            height="140"
            image={thumbnail}
            alt={title}
          /> */}
          {listWithDetails.metadata.youtubeURL
            ? (
            <iframe
              width="100%"
              height="315"
              src={transferYouTubeURL(listWithDetails.metadata.youtubeURL)}
              title="YouTube Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>)
            : (
              <CardMedia
                component="img"
                height="140"
                image={thumbnail}
                alt={title}
              />
              )}
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
              Availability: {availability.map(a => `${new Date(a.start).toLocaleDateString()} to ${new Date(a.end).toLocaleDateString()}`).join(', ')}
            </Typography>
            {/* Display Reviews */}
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Reviews: {reviews.length}
              </Typography>
              {reviews.length > 0 && (<Typography variant="body2" color="text.secondary">
                Average Rating: {reviews.reduce((acc, cur) => acc + parseInt(cur.score), 0) / reviews.length}
              </Typography>
              )}
              <div>
                {[1, 2, 3, 4, 5].map(star => (
                  <RatingStar key={star} value={star} />
                ))}
              </div>
              <Typography variant="h6" gutterBottom>Comments</Typography>
              {listWithDetails && listWithDetails.reviews.length > 0 ? (displayReviews()) : (<Typography>No reviews yet.</Typography>)}
            </Box>

            <Modal open={openModal} onClose={handleClose}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}>
                {listWithDetails.reviews.filter(review => parseInt(review.score, 10) === selectedRating).map((review, index) => (
                  <div key={index}>
                    <p><strong>{review.author}</strong>: {review.comment}</p>
                  </div>
                ))}
              </Box>
            </Modal>

            <Typography variant="body2" color="text.secondary">
              Published: {published ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posted On: {new Date(postedOn).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Booking and Review part */}
      {jwtToken
        ? (
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
              <Rating
                name="review-score"
                value={reviewScore}
                onChange={(event, newValue) => {
                  setReviewScore(newValue);
                }}
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
              {newReview && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{newReview}</Typography>}
            </Box>
          )}
          {/* Display booking status */}
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>My Booking Status</Typography>
            {displayBookingStatus()}
          </Box>
        </Grid>
          )
        : (
        <Grid item xs={12} md={6}>
          <Box mb={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6">Please Login to Book</Typography>
          </Box>
        </Grid>
          )
      }
      {/* Image Gallery or Carousel for `metadata.images` */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {metadata.images.map((image, index) => (
            <Box key={index} sx={{ margin: 1 }}>
              <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
            </Box>
          ))}
        </Box>
      </Grid>

    </Grid>
  );
}
