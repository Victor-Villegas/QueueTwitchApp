const path = require('path');

const morgan = require('morgan');
const exphbs = require('express-handlebars');

// Initialize
// ---------------------------------------
const express = require('express');
const app = express();

// Settings
// ---------------------------------------
app.set('port', process.env.PORT || 3000);
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
// ---------------------------------------
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Variables
// ---------------------------------------

// Routes
// ---------------------------------------
app.use(require('./src/routes/command'));
app.use(require('./src/routes/kirzheka'));
app.use(require('./src/routes/obs'));

// Public
// ---------------------------------------
app.use(express.static(path.join(__dirname, 'src/public')));

// Starting the Server
// ---------------------------------------
const server = app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('joining', () => {
    io.emit('sound');
    io.emit('refresh');
  });

  socket.on('refreshing', () => {
    io.emit('refresh');
  });
});

exports.sound = function () {
  io.emit('sound');
  io.emit('refresh');
};

exports.refresh = function () {
  io.emit('refresh');
};
