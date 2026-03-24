if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('router-plus').express;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const expressLayouts = require('express-ejs-layouts');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

//db connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const authorsRouter = require('./routes/authors');
app.use('/authors', authorsRouter);

const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);

const booksRouter = require('./routes/books');
app.use('/books', booksRouter);

//server start on port 3000
app.listen(process.env.PORT || 3000);

module.exports = app;
