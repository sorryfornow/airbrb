import * as React from 'react';
import { useState, useEffect } from 'react';
import { apiCall } from './helpers';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import PublishListingPopup from './PublishListingPopup';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import styles from './MyListingCard.module.css'

export default function MyListingCard (props) {
  const [curBookings, setCurBookings] = useState([]);
  const [curBookingStatus, setCurBookingStatus] = useState('');
  const jwtToken = localStorage.getItem('jwtToken');
  const { data } = props
  const lstId = data.id;
  const bedrooomDetails = data.metadata.bedroomDetails
  let numOfBeds = 0
  let daysBookedThisYear = 0;
  let totalProfitThisYear = 0;

  // Calculate how long the listing has been up online
  const daysOnline = dayjs().diff(dayjs(data.postedOn), 'day');
  // Calculate the number of days booked this year and total profit
  curBookings.forEach(booking => {
    if (booking.status === 'accepted' && dayjs(booking.dateRange.startDate).year() === dayjs().year()) {
      const days = dayjs(booking.dateRange.endDate).diff(dayjs(booking.dateRange.startDate), 'day');
      daysBookedThisYear += days;
      totalProfitThisYear += booking.totalPrice;
    }
  });

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

  const fetchBooking = async () => {
    try {
      const { bookings } = await apiCall('bookings/', null, jwtToken, 'GET');
      if (bookings && Array.isArray(bookings)) {
        const curLstBooking = bookings.filter(booking => parseInt(booking.listingId) === lstId);
        if (curLstBooking.length > 0) {
          setCurBookings(curLstBooking);
        }
      } else {
        console.error('Unexpected response format:', bookings);
      }
    } catch (err) {
      console.error('Error fetching booking status:', err);
    }
  };

  const handleUnpublish = () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const reqData = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    }
    fetch(`http://localhost:5005/listings/unpublish/${data.id}`, reqData)
      .then(res => res.json())
      .then(res => {
        if (res.error) alert(res.error);
        else {
          alert('Listing unpublished successfully');
          navigate('/mylistings', { replace: true });
        }
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchBooking();
  }, [jwtToken, data.id, curBookingStatus]);

  const handleAcceptBooking = async (bookingId) => {
    const response = await apiCall(`bookings/accept/${bookingId}/`, null, jwtToken, 'PUT');
    if (response.error) {
      alert(response.error);
    } else {
      alert('Booking accepted successfully');
      // render
      setCurBookingStatus('accepted');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const response = await apiCall(`bookings/decline/${bookingId}/`, null, jwtToken, 'PUT');
    if (response.error) {
      alert(response.error);
    } else {
      alert('Booking rejected successfully');
      // render
      setCurBookingStatus('rejected');
    }
  };

  return (
    <Card className={styles.card}>
      <CardMedia
        className={styles.cardMedia}
        image={data.thumbnail || require('./house_icon_1.png')}
        title="thumbnail"
        data-cy='card-thumbnail'
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title || 'no title'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {data.address.street}, {data.address.city}, {data.address.state},{ data.address.postcode},{data.address.country}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Property Type: {data.metadata.type || 'unkown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: {data.price || 'unkown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of beds: {numOfBeds || 'unkown'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Amenities:
        </Typography>

        {data.metadata.amenities.map((a, i) => <Typography variant="body2" color="text.secondary" key={i} >
          - {a}
        </Typography>)}

        <Typography variant="body2" color="text.secondary">
          Rating:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of reviews: {data.reviews.length}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleEdit} size="small" data-cy={'edit-listing-button'}>Edit</Button>
        <PublishListingPopup listingID={data.id}/>
        <Button onClick={handleUnpublish} variant="outlined" data-cy={'unpublish-listing-button'}>Unpulish</Button>
      </CardActions>

      {/* Display Current Bookings */}
      {curBookings.length > 0 && (
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Property Profit:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Published Online Days: {daysOnline} days
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Days Booked This Year: {daysBookedThisYear}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Profit This Year: ${totalProfitThisYear}
          </Typography>

          <Typography gutterBottom variant="h6" component="div">
            Current Bookings
          </Typography>
          {curBookings.map((booking, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Guest: {booking.owner}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dates: {booking.dateRange.startDate} to {booking.dateRange.endDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Price: ${booking.totalPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {booking.status}
              </Typography>
              {/* if booking.status is pending, enable button */}
              { booking.status === 'pending' && (
                <Box>
                  <Button onClick={() => handleAcceptBooking(booking.id)} size="small" data-cy={'accept-booking-button'}>Accept</Button>
                  <Button onClick={() => handleRejectBooking(booking.id)} size="small" data-cy={'reject-booking-button'}>Reject</Button>
                </Box>
              )}
            </Box>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
