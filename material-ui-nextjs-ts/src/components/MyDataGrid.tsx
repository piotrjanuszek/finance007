import * as React from 'react';
import { useState, useEffect } from 'react'; 
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const columns = [
  { field: 'bond_name', headerName: 'Asset Name', width: 130 },
  { field: 'quantity', headerName: 'Quantity', width: 90 },
  { 
    field: 'purchase_date', 
    headerName: 'Purchase Date', 
    width: 150, 
    type: 'date',
    valueGetter: (value) => new Date(Date.parse(value)),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    renderCell: (params) => (
      <GridActionsCellItem icon={<EditIcon />} onClick={() => handleEditClick(params.row)} />
    ),
  },
];

const MyDataGrid = () => {
  const [rows, setRows] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5555/bonds');
        const data = await response.json();
        console.log(data)
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null); 
  };

  const handleSave = () => {
    // Handle saving logic here (e.g., send updated data to backend)
    setOpen(false);
    setSelectedRow(null); 
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Bond</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <TextField 
                label="Asset Name" 
                value={selectedRow.assetName} 
                onChange={(e) => 
                  setSelectedRow({ 
                    ...selectedRow, 
                    assetName: e.target.value 
                  }) 
                } 
                fullWidth 
              />
              {/* Add other fields for editing */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyDataGrid;