const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

// Initializations
const app = express();

// Settings
// ---------------------------------------
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
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
