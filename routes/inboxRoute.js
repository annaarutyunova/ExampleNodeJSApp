const express = require("express")
const router = new express.Router()
const inboxController = require("../controllers/inboxController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inbox-validation')


// Deliver inbox view
router.get("/:account_id", utilities.handleErrors(inboxController.buildInboxView))

// Deliver message view
router.get("/message/:message_id", utilities.handleErrors(inboxController.buildMessageView))

// Deliver reply message view
router.get("/message/reply/:message_id", utilities.handleErrors(inboxController.buildReplyView))

// Create new message in the database
router.post("/create-message", 
regValidate.inboxRules(),
regValidate.checkInboxData,
utilities.handleErrors(inboxController.sendNewMessage))

// Deliver create new message view
router.get("/create-message/:account_id", utilities.handleErrors(inboxController.createNewMessageView))

module.exports = router
