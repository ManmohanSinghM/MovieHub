const express = require('express');
const router = express.Router();
// notice the "../" below - this is crucial!
const { register, login } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;