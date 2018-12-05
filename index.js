const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/logIn'));


app.post('/game/submit', function (req,res) {
    var id = req.body.id;
    console.log("this is the id tht was passed by post: " + id);
    res.render('pages/game',{roomId : id});
});

io.on('connection', function (socket) {
    console.log('a user connected');

    // the string join differentiates the stings that the client side is sending.
    // if client msg had a different string: "not join" the server would look fot
    // socket.on('not join')
    /**
     * socket.join joins a room.
     */
    socket.on('join', function(msg){
       socket.join(msg);
       let roomSize = io.nsps['/'].adapter.rooms[msg].length;
       console.log("the user has connected to room:" + msg);
       console.log("you are the: " + roomSize + " client");

        socket.emit('join',roomSize);
    });

    socket.on('startDeal', (roomName, logString) => {
        console.log(logString);
        console.log(roomName);
        io.in(roomName).emit('startDeal', 1);
    });

    socket.on('deal', function (dealerHand, firstHand, secondHand, thirdHand, trumpCard) {
        console.log("DEALER HAND: " + dealerHand);
        console.log("FIRST HAND: " + firstHand);
        console.log("SECOND HAND: " + secondHand);
        console.log("THIRD HAND: " + thirdHand);
        console.log("TRUMP CARD: " + trumpCard);
    });
});

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
server.listen(PORT);