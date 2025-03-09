const express = require('express');
const cors = require('cors');
const app = express();
const port = 6969;

const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use(express.json());
app.use(cors());

app.use('/manager', managerRoutes);
app.use('/driver', driverRoutes);
app.use('/admin', adminRoutes);
app.use('/accounts', authRoutes);
app.use('/info', dataRoutes);
app.use('/passenger', passengerRoutes);
app.use('/report', reportRoutes);

app.get('/', (req, res) => {
  res.send('Hello from back end!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
