// quick-test.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://manmohansinghmatharoo_db_user:4EqNTbX4TSP1KHiS@cluster0.lbxwlzq.mongodb.net/?appName=Cluster0';
// ↓ replace NEW_PASSWORD with the actual password (no extra quotes), or use the env method below

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000
})
.then(() => {
  console.log('Connected OK');
  process.exit(0);
})
.catch(err => {
  console.error('Connect failed:', err);
  process.exit(1);
});
