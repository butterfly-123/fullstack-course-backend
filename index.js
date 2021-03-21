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

app.use(function(req, res, next) {
    console.log('#### HEADERS', req.headers);

    let domain = 'http://localhost:3002'
    if (process.env.ENV !== 'dev') {
        //domain = "https://dragon-fullstack-front.herokuapp.com"
    }

    res.header("Access-Control-Allow-Origin", domain);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

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
        err,
        type: 'error',
        message: err.message
    })
});

engine.start();

module.exports = app;
