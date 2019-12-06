const express = require('express');
const DB = require('./data/queriesUserDb');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());
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
  console.log(user);
  try {
    if (
      !creds.user_name ||
      !bcrypt.compareSync(creds.password, user.password)
    ) {
      return res.status(401).json({ error: 'YOU-SHALL-NOT-PASS' });
    }

    return res.status(200).json({ message: 'Logged in successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = server;
