const express = require('express');
const connectDB = require('./config/db');

const app = express();
//connect database

connectDB()

//body-parser

app.use(express.json());


//test route

app.get('/', async (req, res) => {
    res.send('Hello Test')
})

const PORT = process.env.PORT || 5000;

//mount route

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})


