import React from 'react'
import { useParams } from 'react-router-dom'

const Test = (props) => {
  const { listingID } = useParams()
  console.log('Test listing ID: ', listingID)
  return (
      <div >
        TEST:
        {props.data}
        {listingID}
      </div>
  )
}
export default Test
