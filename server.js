const express = require('express');
const cors = require('cors');

const userRoutes = require('./Routes/UserRoutes');
const programRoutes = require('./Routes/programRoutes');
const chapterRoutes = require('./Routes/chRoutes');

const app = express();
app.use(express.json()); 
app.use(cors()); 
app.use ('/api/programs', programRoutes)
app.use('/api/users', userRoutes);
app.use('/api', chapterRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
