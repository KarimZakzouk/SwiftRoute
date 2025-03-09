import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'driver_name', headerName: 'Driver Name', width: 200 },
];

export default function Mreq() {
  const [rows, setRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userssn = sessionStorage.getItem('ssn');

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRowIds(newSelectionModel);
  };

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch('http://localhost:6969/manager/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            m_ssn: userssn,  // Sending Manager SSN to get requests
          }),
        });

        const data = await response.json();
        if (data.success) {
          setRows(data.data.map((item, index) => ({
            id: index + 1,
            date: item.date,
            status: item.status,
            driver_name: item.driver_name,
            d_ssn: item.d_ssn,  // Include driver SSN in the row
          })));
        } else {
          console.error('Error fetching data:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    postData();
  }, []);

  const handleResponse = (action) => {
    if (selectedRowIds.length === 0) {
      setErrorMessage('Please select a Request First!');
      setSuccessMessage('');
      return;
    }

    const selectedRequest = selectedRowIds.map((id) => rows.find((row) => row.id === id));

    selectedRequest.forEach((Request) => {
      const response = action === 'accept' ? 'accepted' : 'rejected';

      fetch('http://localhost:6969/manager/respond-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          m_ssn: userssn,
          d_ssn: Request.d_ssn,  // Send the driver's SSN
          date: Request.date,     // Send the date of the request
          response,  // Send the response (accepted or rejected)
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccessMessage(`Request ${response.charAt(0).toUpperCase() + response.slice(1)} successfully`);
            setErrorMessage('');

            // Update the rows after accepting/rejecting
            setRows((prevRows) => 
              prevRows.filter((row) => row.id !== Request.id)
            );
          } else {
            console.error(`Error ${response} Request:`, data);
            setErrorMessage(`Failed to ${response.charAt(0).toUpperCase() + response.slice(1)} Request`);
            setSuccessMessage('');
          }
        })
        .catch((error) => {
          console.error(`Error ${response} Request:`, error);
          setErrorMessage(`Error ${response.charAt(0).toUpperCase() + response.slice(1)} Request`);
          setSuccessMessage('');
        });
    });
  };

  return (
    <div className="List">
      <div className="Mreq">
        <div style={{ height: '400px', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
            onRowSelectionModelChange={(newSelectionModel) => handleSelectionChange(newSelectionModel)}
          />
        </div>
        <div id="selected-row-preview">
          <h3>Selected Row ssn:</h3>
          <pre>{JSON.stringify(selectedRowIds, null, 2)}</pre>
        </div>

        <div id="messages-container">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
        <div className="button-container">
          <ul className="button-list">
            <li>
              <button id="accept-btn" className="button" onClick={() => handleResponse('accept')}>
                Accept
              </button>
            </li>
            <li>
              <button id="reject-btn" className="button" onClick={() => handleResponse('reject')}>
                Reject
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
