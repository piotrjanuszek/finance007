"use client"
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import ProTip from '@/components/ProTip';
import Copyright from '@/components/Copyright';
import App from 'dashboard/Dashboard';
import Dashboard from 'dashboard/Dashboard';
import SessionsChart from 'dashboard/components/SessionsChart';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MyDataGrid from '@/components/MyDataGrid';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const MainPage = () => {
  const [numbers, setNumbers] = useState([]);
  const [assetName, setAssetName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [quantityError, setQuantityError] = useState(false); 
  
  useEffect(() => {
      fetch('http://localhost:5555/numbers')
      .then((res) => res.json())
      .then((data) => {
        setNumbers(data);
      })
    }, []);

  const handleRefresh = async () => {
    const res = await fetch('http://localhost:5555/numbers');
    const newNumbers = await res.json();
    setNumbers(newNumbers);
  };

  const handleChange = (event) => {
    const { id, value } = event.target; 

    if (id === 'asset-name') {
      setAssetName(value); 
    } else if (id === 'quantity') {
      const parsedQuantity = parseInt(value);
      setQuantityError(isNaN(parsedQuantity) || parsedQuantity <=0 ); 
      setQuantity(parsedQuantity); 
      
    }
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify({ 
      assetName, 
      quantity, 
      purchaseDate: selectedDate 
    }));
    try {
      const body = JSON.stringify({ 
        issuer: "obligacje",
        assetName, 
        quantity, 
        purchaseDate: selectedDate 
      })
      console.log(body);
      const response = await fetch('http://localhost:5555/bond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const res = await fetch('http://127.0.0.1:5000/numbers');
  // const numbers = await res.json();
  return (
    <>
    <Button onClick={handleRefresh}>Refresh</Button>
    <SessionsChart yAxis ={numbers}/>
    <Grid container spacing={2} style={{ width: '50%' }}>
    <Grid size={{ xs: 12, md: 6, lg: 3}}>
        <TextField
          id="asset-name"
          label="Asset Name"
          variant="outlined"
          fullWidth
          value={assetName}
          onChange={(e) => handleChange(e)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3}}>
        <TextField
          id="quantity"
          label="Quantity"
          type="number"
          variant="outlined"
          fullWidth
          value={quantity}
          onChange={(e) => handleChange(e)}
          error={quantityError} 
          helperText={quantityError ? 'Quantity must be more than 0' : ''} 
          sx={{ 
            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-input': { 
              color: 'red' 
            } 
          }} 
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            label="Date of purchase"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4}}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Grid>
    <MyDataGrid />

    </>
  );
}

export default MainPage

// export default function Home() {
  

//   function generateRandomFloatNumbers(size: number, min: number, max: number): number[] {
//     if (size <= 0 || min >= max) {
//       throw new Error('Invalid input parameters');
//     }
  
//     const numbers: number[] = [];
  
//     for (let i = 0; i < size; i++) {
//       const randomValue = Math.random() * (max - min) + min;
//       numbers.push(randomValue);
//     }
  
//     return numbers;
//   }

//   const data = [
//     300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300,
//     3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000,
//     6300, 6600, 6900, 7200, 7500, 7800, 8100,
//   ]

  
//   return (
//     <>
//     <Typography>SDA</Typography>
//     <SessionsChart yAxis ={generateRandomFloatNumbers(30, 0, 10000)}/>
//     </>
//   );
// }
