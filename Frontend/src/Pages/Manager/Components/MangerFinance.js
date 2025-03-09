import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import './styles.css';
export default function Managerfinance()
{
     const [rows, setRows] = useState([]);
     const [newSalary, setNewSalary] = useState('');
       const [errorMessage, setErrorMessage] = useState('');
       const [successMessage, setSuccessMessage] = useState('');
    

       const columns = [
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'salary', headerName: 'Income', width: 300 },
        { field: 'total_profit', headerName: 'Total Profit', width: 200 },
      ];
      const userssn = sessionStorage.getItem('ssn');

      const handleAddSalary = () => {
        fetch('http://localhost:6969/manager/manager-add-salary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            m_ssn: userssn,
            salary: newSalary,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setSuccessMessage('Finance Added successfully');
              setErrorMessage('');
        
            } else {
              console.error('Error Adding Finance:', data);
              setErrorMessage('Failed to Add Finance');
              setSuccessMessage('');
            }
          })
          .catch((error) => {
            console.error('Error Adding Finance:', error);
            setErrorMessage('Error Adding Finance');
            setSuccessMessage('');
          });

      }
       useEffect(() => {
           fetch('http://localhost:6969/manager/manager-finance', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               m_ssn: userssn,
             }),
           })
             .then((response) => response.json())
             .then((data) => {
               console.log(data.data);
               if (data.success) {
                 const transformedData = data.data.map((item, index) => ({
                   id: index,
                   date: item.date,
                   salary: item.salary,
                   total_profit: item.total_profit,
                 }));
                 setRows(transformedData);
               } else {
                 console.error('Error in response:', data);
               }
             })
             .catch((error) => console.error('Error fetching data:', error));
         }, [userssn]); 
    return(
<div>
      <div id="data-grid-container" className="grid-container">
        <DataGrid
          id="data-grid"
          rows={rows}
          columns={columns}
          pageSize={5}
        />
      </div>
      <div id="messages-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      <ul>
          <li className="button-item">
            <button
              id="update-salary-btn"
              className="button"
              onClick={handleAddSalary}
            >
              Add Month Finance
            </button>
            <input
              type="number"
              id="new-salary-input"
              placeholder="Enter new salary"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
            />
          </li>
        </ul>
</div>
    );
}