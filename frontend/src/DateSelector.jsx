import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
export default function DateSelector (props) {
  const { id, dates, setDates } = props
  // console.log('dates from dateSelector: ', dates)
  const handleStartDateChange = (e) => {
    const d = e.$d
    const copy = [...dates]
    const currD = copy.find((d) => d.id === id)
    currD.start = d;
    setDates(copy)
  }

  const handleEndDateChange = (e) => {
    const d = e.$d
    const copy = [...dates]
    const currD = copy.find((d) => d.id === id)
    currD.end = d;
    setDates(copy)
  }

  return (
    <>
    <div>
    from:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker onChange={handleStartDateChange} data-cy="date-picker-from"/>
    </LocalizationProvider>
    to:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker onChange={handleEndDateChange} data-cy="date-picker-to"/>
    </LocalizationProvider>
    </div>

    </>

  );
}
