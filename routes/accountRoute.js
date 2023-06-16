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



module.exports = router