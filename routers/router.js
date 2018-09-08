const express = require('express')
// The functions to be attached to each route are required from their each specific file
// High modularization improves maintainability
const feed = require('../controllers/feed'),
    retrieve = require('../controllers/retrieve'),
    write = require('../controllers/write'),
    publish = require('../controllers/publish')

const router = express.Router()

router.route('/').get(feed)
router.route('/write').get(write)
router.route('/publish').post(publish)
router.route('/:alias').get(retrieve)

module.exports = router