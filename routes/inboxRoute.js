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

// Create new message in the database
router.post("/reply", 
regValidate.inboxRules(),
regValidate.checkReply,
utilities.handleErrors(inboxController.reply))

// Deliver create new message view
router.get("/create-message/:account_id", utilities.handleErrors(inboxController.createNewMessageView))

router.get("/message/read/:message_id",utilities.handleErrors(inboxController.markAsRead))

router.get("/message/delete/:message_id", utilities.handleErrors(inboxController.deleteMessage))

router.get("/message/archive/:message_id", utilities.handleErrors(inboxController.archiveMessage))

// Archive
router.get("/archive/:account_id", utilities.handleErrors(inboxController.archivedMessages))


module.exports = router
