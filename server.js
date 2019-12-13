const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const DB = require('./data/queriesUserDb');
const bcrypt = require('bcryptjs');
const restricted = require('./data/auth/restrictedMw.js');

const sessionOptions = {
  name: 'skatesesh',
  secret: 'ollieollieoxenfree',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require('./data/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));


server.get('/', (req, res) => {
  res.json({ api: 'up' });
});
// KingTable
// swampDollar3for10
// SECRET PASSWORD PLEASE DON'T SHARE THNAKS

//  "user_name": "wickedGoose",
// 	"password": "hollers4thebronx&gets$$$forthehonks",
// 	"favorite_color": "Orange and White. Creamsicle, yo!"
// SECRET PASSWORD PLEASE DON'T SHARE THNAKS

server.post('/api/register', async (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;

  try {
    const userAddSuccess = await DB.addUser(creds);
    res.status(200).json(userAddSuccess);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.post('/api/login', async (req, res) => {
  const creds = req.body;
  const user = await DB.login(creds.user_name);

  req.session.loggedin = false;
  try {
    if (
      !creds.user_name ||
      !bcrypt.compareSync(creds.password, user.password)
    ) {
      return res.status(401).json({ error: 'YOU-SHALL-NOT-PASS' });
    }
    req.session.loggedin = true;
    return res.status(200).json({
      message: `Hey, ${user.user_name}! You logged in successfully! Finally! You made it!`
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

server.delete('/api/logout', restricted, (req, res) => {
  if (req.session) {
    console.log(req.session);
    // check out the documentation for this method at
    // https://www.npmjs.com/package/express-session, under Session.destroy().
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send('You can never go home again.');
      } else {
        res.send("Bye. We won't miss you.");
      }
    });
  } else {
    res.end();
  }
});

module.exports = server;
