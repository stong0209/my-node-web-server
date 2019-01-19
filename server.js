const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const util = require('util');

const appendFile = util.promisify(fs.appendFile);



let app = express();

// Enable template engine - Handlebar
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text, text2) => {
  return text.toUpperCase() + ': ' + text2;
});

// custom middleware to send maintenance page
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// custom middleware to log
app.use((req, res, next) => {
  console.log(
    `middleware log: ${req.method} ${req.url}`);
  // fs.appendFile('./logs/logfile.txt',
  //   `middleware log: ${req.method} ${req.url}\r\n`,
  //   (error) => {
  //     if (error) {
  //       console.log(error);
  //     }
  //   }
  // );
  appendFile('./logs/logfile.txt',
    `middleware log: ${req.method} ${req.url}\r\n`,
  ).then((data) => {
    console.log(`log to file.`);
  }
  ).catch((error) => {
    console.log(error);
  });
  next();
});

// use middleware for static routing
// express uses absolute path - use __dirname for root folder being passed in
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    //currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  });
});


app.listen(3000, () => {
  console.log('Server is up at 3000');
});