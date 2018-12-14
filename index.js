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
       if(roomSize <= 4) {
           console.log("the user has connected to room:" + msg);
           socket.emit('join', roomSize);
       }
       else{
           socket.leave(msg);
           let fullRoomMsg = "sorry, room " + msg + " is full";
           socket.emit('full room', fullRoomMsg);
       }

    });

    socket.on('startDeal', (roomName, logString) => {
        console.log(logString);
        console.log(roomName);
        io.in(roomName).emit('startDeal', 1);
    });

    socket.on('deal', function (fullDeck, roomName) {
       io.in(roomName).emit('deal', fullDeck);

    });

    socket.on('TrickBet', (playerNumberString, tricksBetByAllPlayersString, roomName) => {
        socket.to(roomName).emit('TrickBet', playerNumberString, tricksBetByAllPlayersString);
    });

    socket.on('allPlayersBets', (pastPlayerNumberString, lastPlayerBet, roomName) => {
        socket.to(roomName).emit('allPlayersBets', pastPlayerNumberString, lastPlayerBet);
    });

    socket.on('whoCanPlayCard', (userWhoCanBet, roomName) => {
        io.in(roomName).emit('whoCanPlayCard', userWhoCanBet);
    });

    socket.on('addingCardToBoard', (cardAndSenderString, roomName) => {
        io.in(roomName).emit('addingCardToBoard', cardAndSenderString);
    });

    socket.on('newRound', (roomName, nextDealerNumberString, nextRoundNumberString) => {
       io.in(roomName).emit('newRound', nextDealerNumberString, nextRoundNumberString);
    });

    socket.on('end', (userTallyString, roomName) => {
       socket.to(roomName).emit('end', userTallyString);
    });

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
    });

    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
server.listen(PORT);