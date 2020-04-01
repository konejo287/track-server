require('./models/User');
require('./models/Game');
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
const app = express();
app.use(cors());
app.set('port', (process.env.PORT || 3000));
const bodyParser = require('body-parser');

const mongoUri = 'mongodb+srv://mario:oeuB10GLNrBfWkO4@cluster0-4xbkm.mongodb.net/test?retryWrites=true&w=majority';
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const requireAuth = require('./middlewares/requireAuth');


app.use(bodyParser.json());
app.use(authRoutes);
app.use(gameRoutes);

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

app.listen(app.get('port'), function(){
    console.log('Listening on port 3000');
});
