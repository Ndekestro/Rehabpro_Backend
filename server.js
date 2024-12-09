const express = require('express');
const cors = require('cors');

const userRoutes = require('./Routes/UserRoutes');

const app = express();
app.use(express.json()); 
app.use(cors()); 

app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
