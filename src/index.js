require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const mongoUri = 'mongodb+srv://mario:oeuB10GLNrBfWkO4@cluster0-4xbkm.mongodb.net/test?retryWrites=true&w=majority';
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');


app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to instance');
})

mongoose.connection.on('error', (err) => {
    console.error('Error connection to mongo, ' , err);
});

app.get('/', requireAuth, function(req, res) {
    
    
    res.send(`Yuor email: ${req.user.email}`);
})

app.listen(3000, function(){
    console.log('Listening on port 3000');
});
