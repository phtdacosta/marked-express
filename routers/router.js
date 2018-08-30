const express = require('express')
const controller = require('../controllers/controller')

const router = express.Router()

router.route('/write').get(controller.write)
router.route('/publish').post(controller.publish)
router.route('/').get(controller.feed)
router.route('/:alias').get(controller.retrieve)

module.exports = router