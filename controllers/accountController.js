/*************************************
* Account Contoller
* Unite 4, deliver login view activity
***************************************/
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/*************************************
* Deliver login view
* Unite 4, deliver login view activity
***************************************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null

    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      req.flash(
        "success semi-bold",
        `Congratulations, ${account_firstname}, you\'re registered . Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
 let nav = await utilities.getNav()
 const { account_email, account_password } = req.body
 const accountData = await accountModel.getAccountByEmail(account_email)
 console.log(accountData)
 if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
 return
 }
 try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
  delete accountData.account_password
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  return res.redirect("/account/")
  } else {
    req.flash("notice", "Check your credentials")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors:null,
      account_email,
    })
  }
 } catch (error) {
  return new Error('Access Forbidden')
 }
}



// Account Management
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  req.flash("success semi-bold", "You're logged in")
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null
  })
}

// Build edit account view. GET
async function buildEditAccountView(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountDataById(account_id)
  res.render("account/edit-account", {
    title: "Edit Account Infromation",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname : accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_email : accountData.account_email
  })
}

// Update account info. POST
async function updateAccountData(req, res) {
  let nav = await utilities.getNav()
  // const account_id = req.params.account_id
  // const accountData = await accountModel.getAccountDataById(account_id)
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  console.log(`updateAccountData in accountController ${account_id}`)
  const result = await accountModel.updateAccountData(
    account_firstname,
    account_lastname,
    account_email,
    account_id)
    const accountData = await accountModel.getAccountDataById(account_id)
  if(result){
  try {
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return req.flash("success semi-bold", "The account was updated"), res.redirect("/account/")
    } catch (error) {
    return new Error('Access Forbidden')
   }
  } else {
    req.flash("notice", "Sorry, the update failed. Please try again.")
    res.status(501).render(`/account/edit-account`, {
      title: "Edit Account Infromation",
      nav,
      errors: null,
      account_id : account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    })
}
}

// Update account password. POST. No GET needed
async function updateAccountPasswordData(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password} = req.body
  // Hash before storing
  let hashedPassword = await bcrypt.hashSync(account_password, 10)
  console.log(hashedPassword)
  const accountPassword = await accountModel.updatePassword(hashedPassword, account_id)
  const accountData = await accountModel.getAccountDataById(account_id)
  if(accountPassword){
    try{
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return req.flash("success semi-bold", "The account password was updated"), res.redirect("/account/")
      } catch (error) {
      return new Error('Access Forbidden')
    }
    } else {
      req.flash("notice", "Sorry, the change of password failed.")
      res.status(501).render(`account/edit-account/:${account_id}`, {
        title: "Edit Account Information",
        nav,
        errors: null,
        account_id: account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
      })
    }
}


// Build Inbox View
async function buildInboxView(req, res) {
  let nav = await utilities.getNav()
  let firstname = res.locals.accountData.account_firstname
  let lastname = res.locals.accountData.account_lastname
  const account_id = req.params.account_id
  const inboxData = await accountModel.getMessageFromAccountId(account_id)
  console.log(account_id)
  console.log("Inbox Data" + inboxData.rows)
  const table = await utilities.buildInbox(inboxData)
  console.log(table)
  res.render(`account/inbox`, {
    title: firstname + " " + lastname + " " +  "Inbox",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname : firstname,
    account_lastname : lastname,
    table
  })
}

// Build Message View
async function buildMessageView(req, res) {
  let nav = await utilities.getNav()
  // let firstname = res.locals.accountData.account_firstname
  // let lastname = res.locals.accountData.account_lastname
  // const account_id = req.params.account_id
  const message_id = req.params.message_id
  const messageInfo = await accountModel.getMessageByMessageId(message_id)
  const div = await utilities.buildMessage(messageInfo)
  console.log("Div" + div)
  console.log("message_id = " + message_id)
  console.log("messageInfo is " + messageInfo[0].message_body)
  res.render(`./account/message`, {
    title: "View Message",
    nav,
    errors: null,
    div,
    message_id: message_id,
    
  })
}

  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildEditAccountView, updateAccountData, updateAccountPasswordData, buildInboxView, buildMessageView}