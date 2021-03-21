const express = require('express');
//const cors = require('cors');
const pool = require('./databasePool');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const GenerationEngine = require('./generation/engine');
const dragonRouter = require('./api/dragon');
const generationRouter = require('./api/generation');
const accountRouter = require('./api/account');

const app =  express();
const engine = new GenerationEngine();

app.locals.engine = engine;

//backend: localhost:3000
//frontend: localhost:3001

const cors = {
    origin: ["localhost:3001","localhost:3002"],
    default: "localhost:3001"
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

    next()
});
//
// app.all('*', function(req, res, next) {
//
//     let origin = cors.origin.indexOf(req.header('origin').toLowerCase()) > -1 ? req.headers.origin : cors.default;
//
//     console.log(req.header('origin'),origin)
//
//
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', accountRouter);
app.use('/dragon', dragonRouter);
app.use('/generation', generationRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.log("#### DZIADZIUS ####", err, err.statusCode);

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

app.get('/init-db', (request, response) => {
    const query = `
        SELECT * FROM dragon 
    `;

    pool.query(query, (err, res) => {
            console.log(err, res);

            if (err) return console.log('error', err);

            response.json(res.rows);
        }
    );
});

engine.start();

module.exports = app;

// const Generation = require('../dragonstack/generation');
//
// const generation = new Generation();
//
// console.log('generation', generation);
//
// const gooby = generation.newDragon();
//
// console.log('gooby', gooby);
//
// setTimeout(() => {
//    const mimar = generation.newDragon();
//
//    console.log('mimar', mimar);
//
// }, 1500);




// const Dragon = require('./dragon');
//
// const fooey = new Dragon({
//     birthdate: new Date(),
//     nickname: 'fooey'
// });
//
// const baloo = new Dragon({
//     birthdate: new Date(),
//     nickname: 'baloo ',
//     traits: [{ traitType: 'backgroundColor', traitValue: 'green'}]
// });
//
// setTimeout(() => {
//     const goobe = new Dragon({});
//     console.log('goobe', goobe);
// }, 3000);
//
// const mimar = new Dragon({});
//
//
// console.log('fooey', fooey);
// console.log('baloo', baloo);
// console.log('mimar', mimar);
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const password = 'aneta';
//
// const SHA256 = require('crypto-js/sha256');
// const APP_SECRET = 'alalala';
//
// for (let i=0; i<10000; i++) {
//     // bcrypt.genSalt(saltRounds, function (err, salt) {
//     //     bcrypt.hash(password, salt, function (err, hash) {
//     //         console.log("#### BCRYPT HASH ####", {password, hash})
//     //
//     //     });
//     // });
//
//     const hash = SHA256(`${APP_SECRET}${password}${APP_SECRET}`).toString()
//     console.log("#### SHA256 HASH ####", {i, password, hash})
//
// }
//
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(password, salt, function(err, hash) {
//         console.log("#### BCRYPT HASH ####", {password, hash})
//     });
// });
