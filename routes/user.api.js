const express = require('express');
const router = express.Router()
const userController = require('../controllers/user.controller');

//회원가입
router.get('/', userController.createUser);

module.exports = router