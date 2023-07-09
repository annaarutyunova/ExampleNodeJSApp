/**************************************
 * Account routes
 * Unit 4, deliver login view activity
 ***************************************/
// Neede Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/**************************************
 * Deliver Login View
 * Unit 4, deliver login view activity
 ***************************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
    )

// Add a default route for accounts.
router.get("/", utilities.checkLogin , utilities.handleErrors(accountController.buildAccountManagement))

router.post("/edit-account/", 
regValidate.updateAccountRules(),
regValidate.checkAccountData,
utilities.handleErrors(accountController.updateAccountData))

router.post("/edit-password/", 
regValidate.updateAccountPasswordRules(),
regValidate.checkPassword,
utilities.handleErrors(accountController.updateAccountPasswordData))

router.get("/edit-account/:account_id", utilities.handleErrors(accountController.buildEditAccountView))


// // Deliver inbox view
// router.get("/inbox/:account_id", utilities.handleErrors(accountController.buildInboxView))

// // Deliver message view
// router.get("/inbox/message/:message_id", utilities.handleErrors(accountController.buildMessageView))

// // Deliver reply message view
// router.get("/inbox/message/reply/:message_id", utilities.handleErrors(accountController.buildReplyView))

// // Deliver create new message view
// router.get("/inbox/new-message", utilities.handleErrors(accountController.createNewMessageView))

module.exports = router