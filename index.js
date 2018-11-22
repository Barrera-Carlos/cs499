const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const io = require('socket.io')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/logIn'));


app.post('/game/submit', function (req,res) {
    var id = req.body.id;
    console.log("this is the id tht was passed by post: " + id);
    res.render('pages/game');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
