const express = require('express');
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

// const cors = {
//     origin: ["localhost:3001","localhost:3002"],
//     default: "localhost:3001"
// }

// if (process.env.ENV === 'dev') {
//     const domain = 'localhost:3001'
// }


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "'https://dragon-fullstack-front.herokuapp.com");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/account', accountRouter);
app.use('/dragon', dragonRouter);
app.use('/generation', generationRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

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

