import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
export default function DateSelector () {
  return (
    <>

    <div>
    from:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker />
    </LocalizationProvider>
    to:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker />
    </LocalizationProvider>
    </div>

    </>

  );
}
