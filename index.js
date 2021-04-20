const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

// Initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'src/views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./src/lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Variables
app.use((req, res, next) => {
  next();
});

// Routes
// app.use(require('./routes'));
app.use(require('./src/routes/authentication'));
app.use('/links', require('./src/routes/links'));
app.use(require('./src/routes/command'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the Server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

// const tmi = require('tmi.js');
// const mysql = require('mysql');
// require('dotenv').config();

// const regexpCommand = /^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/;

// const commands = {
//   funame: {
//     response: 'https://spacejelly.dev'
//   },
//   upvote: {
//     response: (argument) => `Successfully upvoted ${argument}`
//   }
// };

// const sql = mysql.createConnection({
//   host: process.env.SQL_HOST,
//   user: process.env.SQL_USER,
//   password: process.env.SQL_PASSWORD
// });

// sql.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected to DB');
// });

// const client = new tmi.Client({
//   connection: {
//     reconnect: true
//   },
//   channels: [
//     't_songbird'
//   ],
//   identity: {
//     username: process.env.TWITCH_BOT_USERNAME,
//     password: process.env.TWITCH_OAUTH_TOKEN
//   }
// });

// client.connect();

// client.on('message', async (channel, context, message) => {
//   if (self) return;

//   const [raw, command, argument] = message.match(regexpCommand);

//   const { response } = commands[command] || {};

//   if (typeof response === 'function') {
//     client.say(channel, response(argument));
//   } else if (typeof response === 'string') {
//     client.say(channel, response);
//   }
// });
