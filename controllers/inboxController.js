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
    console.log('hi'+inboxData)
    const table = await utilities.buildInbox(inboxData)
    // console.log(table)
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
    // console.log("Div" + div)
    // console.log("message_id = " + message_id)
    // console.log("messageInfo is " + messageInfo[0].message_body)
    res.render(`./inbox/message`, {
      title: "View Message",
      nav,
      errors: null,
      div,
      message_id: message_id,
    })
  }
  
  // Build Reply View
  async function buildReplyView(req, res) {
    let nav = await utilities.getNav()
    const message_id = req.params.message_id
    const messageInfo = await inboxModel.getMessageByMessageId(message_id)
    const div = await utilities.buildMessage(messageInfo)
    // console.log("Div" + div)
    // console.log("message_id = " + message_id)
    // console.log("messageInfo is " + messageInfo[0].message_body)
    res.render(`./inbox/reply`, {
      title: "Reply Message",
      nav,
      errors: null,
      div,
      message_id: message_id,
    })
  }
  
  // Build Create New Message View
  async function createNewMessageView(req, res){
    let nav = await utilities.getNav()
    // let select = await utilities.selectEmail()
    res.render('./inbox/new-message',{
      title: "New Message",
      nav,
    //   select,
      errors: null,
    })
}

module.exports = { buildInboxView, buildMessageView, buildReplyView, createNewMessageView}