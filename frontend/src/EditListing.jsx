import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Test = (props) => {
  const { id } = useParams()
  const [listing, setListing] = useState()
  useEffect(() => {
    console.log('Test listing ID: ', listing)
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
        }
      } catch (e) {
        alert(e)
      }
    }
    getListing()
  }, [])

  return (
      <div >
        TEST:
        {id}
      </div>
  )
}
export default Test
