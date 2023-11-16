import React, { useState, useEffect } from 'react';
import { apiCall } from './helpers';
import { Container, Card, CardContent, Typography, Button, Grid } from '@mui/material';

const MyBookings = (props) => {
  const userEmail = localStorage.getItem('userEmail');
  const jwtToken = localStorage.getItem('jwtToken');
  const [userBookings, setUserBookings] = useState([]);
  const [listingsDetails, setListingsDetails] = useState({});
  const [reload, setReload] = useState(false);

  const fetchListingsDetails = async (bookings) => {
    const uniqueListIds = [...new Set(bookings.map(booking => booking.listingId))];
    const listingsResponses = {};
    for (let i = 0; i < uniqueListIds.length; i++) {
      const id = uniqueListIds[i];
      try {
        const response = await apiCall(`listings/${id}`, null, jwtToken, 'GET');

        if (response && response.listing) {
          listingsResponses[id] = response.listing;
        }
      } catch (error) {
        console.error(`Error fetching details for listing ${id}:`, error);
      }
    }
    console.log('listingsResponses:', listingsResponses);
    setListingsDetails(listingsResponses);
  };

  const fetchMyBookings = async () => {
    try {
      const { bookings } = await apiCall('bookings', null, jwtToken, 'GET');
      if (bookings && Array.isArray(bookings)) {
        const curUserBooking = bookings.filter(booking => booking.owner === userEmail);
        setUserBookings(curUserBooking);
        await fetchListingsDetails(curUserBooking);
      } else if (bookings && bookings.error) {
        console.error('Unexpected response format:', bookings);
        alert(bookings.error);
      } else {
        alert('Unexpected response');
      }
    } catch (error) {
      console.error('Error fetching booking status:', error);
      alert(error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const response = await apiCall(`bookings/${bookingId}/`, null, jwtToken, 'DELETE');
    if (response.error) {
      alert(response.error);
    } else {
      setReload(!reload);
      alert('Booking cancelled successfully');
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [jwtToken, userEmail, reload]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>
      {userBookings.length > 0
        ? (
            <Grid container spacing={2}>
              {userBookings.map((booking, index) => {
                const listingDetail = listingsDetails[booking.listingId];
                if (!listingDetail || !listingDetail.address) return (<></>);
                console.log('listingDetail:', listingDetail);
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Listing Title: {listingDetail?.title || 'Loading...'}</Typography>
                        <Typography variant="body1">Address: {listingDetail?.address.street || 'Loading...'}</Typography>
                        <Typography variant="body1">Dates: {booking.dateRange.startDate} - {booking.dateRange.endDate}</Typography>
                        <Typography variant="body1">Total Price: ${booking.totalPrice}</Typography>
                        <Typography variant="body1">Status: {booking.status}</Typography>
                        <Button variant="outlined" color="error" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )
        : (
            <Typography variant="subtitle1">You have no bookings at the moment.</Typography>
          )}
    </Container>
  );
};

export default MyBookings;
