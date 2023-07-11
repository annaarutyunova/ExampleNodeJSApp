/*************************************
* Inbox Contoller
***************************************/
const utilities = require("../utilities")
const inboxModel = require("../models/inbox-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Build Inbox View
async function buildInboxView(req, res) {
    let nav = await utilities.getNav()
    let firstname = res.locals.accountData.account_firstname
    let lastname = res.locals.accountData.account_lastname
    const account_id = req.params.account_id
    const inboxData = await inboxModel.getMessageFromAccountId(account_id)
    const table = await utilities.buildInbox(inboxData)
    res.render(`inbox/inbox`, {
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
    const messageInfo = await inboxModel.getMessageByMessageId(message_id)
    const div = await utilities.buildMessage(messageInfo)
    console.log(messageInfo)
    console.log("message_subject = " + messageInfo[0].message_subject)
    res.render(`./inbox/message`, {
      title: `${messageInfo[0].message_subject}`,
      nav,
      errors: null,
      div,
      message_id: message_id,
    })
  }
 
  
  // Build Create New Message View
  async function createNewMessageView(req, res){
    let nav = await utilities.getNav()
    let select = await utilities.selectEmail()
    res.render('./inbox/create-message',{
      title: "New Message",
      nav,
      select,
      errors: null,
    })
}

async function sendNewMessage(req, res){
    let nav = await utilities.getNav()
    const {account_id, message_subject, message_body} = req.body
    const message_from = res.locals.accountData.account_id
    console.log("Message_from from payload", message_from)
    const inserted = await inboxModel.sendMessage(parseInt(account_id), message_from, message_subject, message_body)
    let select = await utilities.selectEmail(parseInt(account_id))
    if (inserted) {
        req.flash(
          "success semi-bold",
          `The message was sent.`
        )
        res.redirect(`/inbox/${res.locals.accountData.account_id}`)
    } else {
        req.flash("notice", "Sorry, the message could not be sent.")
        res.status(501).render("./inbox/create-message", {
          title: "New Message",
          nav,
          select: select,
          errors: null,
          account_id,
          message_from,
          message_subject,
          message_body
        })
    }
}

 
  // Build Reply View
  async function buildReplyView(req, res) {
    let nav = await utilities.getNav()
    const message_id = req.params.message_id
    const messageInfo = await inboxModel.getMessageByMessageId(message_id)
    res.render(`./inbox/reply`, {
      title: "Reply Message",
      nav,
      errors: null,
      message_id: message_id,
      message_subject:messageInfo[0].message_subject, 
      message_body:messageInfo[0].message_body, 
      message_from:messageInfo[0].message_from,
      account_firstname:messageInfo[0].account_firstname,
      account_lastname:messageInfo[0].account_lastname
      // p
    })
  }


module.exports = { buildInboxView, buildMessageView, buildReplyView, createNewMessageView, sendNewMessage}