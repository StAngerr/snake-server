const config = require('config');
const mongoose = require('mongoose');
const usersRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const express = require('express');
const auth = require('./middleware/auth');
const app = express();
const corsHeaders = require('./middleware/cors');

if (!config.get('privateKey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.');
  process.exit(1);
}

mongoose
    .connect('mongodb://localhost/snake', {useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.use(corsHeaders);

app.use('/api/auth', authRoute);
app.use('/api/users', auth, usersRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
