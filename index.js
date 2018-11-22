const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/logIn'));


app.post('/game/submit', function (req,res) {
    //var id = req.body.id;
    res.redirect('pages/game/');
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
