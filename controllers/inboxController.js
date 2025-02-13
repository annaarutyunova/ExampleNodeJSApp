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
    const archived_messages = await inboxModel.getArchivedMessagesByAccountId(account_id)
    // console.log("Archived Messages", archived_messages[0].count)
    res.render(`inbox/inbox`, {
      title: firstname + " " + lastname + "'s " +  "Inbox",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname : firstname,
      account_lastname : lastname,
      table,
      archived_messages: archived_messages[0].count
    })
  }
  
  // Build Message View
  async function buildMessageView(req, res) {
    let nav = await utilities.getNav()
    const message_id = req.params.message_id
    const messageInfo = await inboxModel.getMessageByMessageId(message_id)
    const div = await utilities.buildMessage(messageInfo)
    // console.log(messageInfo)
    // console.log("message_subject = " + messageInfo[0].message_subject)
    res.render(`./inbox/message`, {
      title: `${messageInfo[0].message_subject}`,
      nav,
      errors: null,
      div,
      message_id: message_id
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

// Post new message
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
    // console.log(messageInfo[0].message_id)
    let select = await utilities.selectEmail(parseInt(messageInfo[0].message_from))
    const spaces = "\n\n\n\n////Previous Message////\n"
    const re = "RE:"
    res.render(`./inbox/reply`, {
      title: "Reply Message",
      nav,
      errors: null,
      message_id: message_id,
      message_subject:messageInfo[0].message_subject, 
      message_body:messageInfo[0].message_body, 
      message_from:messageInfo[0].message_from,
      account_firstname:messageInfo[0].account_firstname,
      account_lastname:messageInfo[0].account_lastname,
      spaces,
      re,
      select
    })
  }

// Post reply
async function reply(req, res){
  let nav = await utilities.getNav()
  const {account_id, message_subject, message_body} = req.body
  const message_from = res.locals.accountData.account_id
  // console.log("Message_from from payload", message_from)
  const inserted = await inboxModel.sendMessage(parseInt(account_id), message_from, message_subject, message_body)
  const spaces = "\n\n\n\n////Previous Message////\n"
  const re = "RE:"
  let select = await utilities.selectEmail(parseInt(account_id))
  // console.log("Accountid ", account_id)
  if (inserted) {
      req.flash(
        "success semi-bold",
        `Replied successfully.`
      )
      res.redirect(`/inbox/${res.locals.accountData.account_id}`)
  } else {
      req.flash("notice", "Sorry, the message could not be sent.")
      res.status(501).render("./inbox/reply", {
        title: "Reply Message",
        nav,
        errors: null,
        account_id,
        message_from,
        message_subject,
        message_body,
        spaces,
        re,
        select
      })
  }
}

async function markAsRead(req, res){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  const message_read = await inboxModel.markAsRead(message_id)
  const messageInfo = await inboxModel.getMessageByMessageId(message_id)
  const archived_messages = await inboxModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id)
  const div = await utilities.buildMessage(messageInfo)
  // console.log(messageInfo)
  // console.log("message_subject = " + messageInfo[0].message_subject)
  if (message_read) {
    req.flash(
      "success semi-bold",
      `Marked as read.`
    )
    const inboxData = await inboxModel.getMessageFromAccountId(res.locals.accountData.account_id)
    const table = await utilities.buildInbox(inboxData)
    res.status(201).render(`inbox/inbox`, {
      title: `${messageInfo[0].message_subject}`,
      nav,
      errors: null,
      div,
      message_id: message_id,
      message_read: messageInfo[0].message_read,
      table,
      archived_messages: archived_messages[0].count

    })
} else {
  req.flash(
    "notice semi-bold",
    `Something went wrong.`
  )
  res.redirect(`/inbox/message/${res.locals.accountData.account_id}`)
}
}

// Delete Message
async function deleteMessage(req, res){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  // console.log("Message_id", message_id)
  const messageInfo = await inboxModel.deleteMessage(message_id)
  const archived_messages = await inboxModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id)
  if (messageInfo) {
    req.flash(
      "success semi-bold",
      `Message deleted.`
    )
    const inboxData = await inboxModel.getMessageFromAccountId(res.locals.accountData.account_id)
    const table = await utilities.buildInbox(inboxData)
    res.status(201).render(`inbox/inbox`, {
      title: "inbox",
      nav,
      errors: null,
      table,
      archived_messages: archived_messages[0].count

    })
    } else {
      req.flash(
        "notice semi-bold",
        `Something went wrong.`
      )
      res.redirect(`/inbox/message/${res.locals.accountData.account_id}`)
    }
}

// Archive Message
async function archiveMessage(req,res){
  console.log("Here")
  console.log("There",req.params.message_id)
  const message_id = req.params.message_id
  console.log("Message_id", message_id)
  // const account_id = req.params.account_id
  // const inboxData = await inboxModel.getMessageFromAccountId(account_id)
  const archive = await inboxModel.messageArchived(message_id)
  const archived_messages = await inboxModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id)
  if (archive) {
    req.flash(
      "success semi-bold",
      `Message archived.`
    )
    let nav = await utilities.getNav()
    const inboxData = await inboxModel.getMessageFromAccountId(res.locals.accountData.account_id)
    const table = await utilities.buildInbox(inboxData)
    res.status(201).render(`inbox/inbox`, {
      title: "inbox",
      nav,
      errors: null,
      table,
      archived_messages: archived_messages[0].count,
      archive
    })
    } else {
      req.flash(
        "notice semi-bold",
        `Something went wrong.`
      )
      res.redirect(`/inbox/message/${res.locals.accountData.account_id}`)
    }
}


// Archived Messages
async function archivedMessages(req, res) {
  let nav = await utilities.getNav()
  let firstname = res.locals.accountData.account_firstname
  let lastname = res.locals.accountData.account_lastname
  const message_id = req.params.message_id
  const account_id = req.params.account_id
  const inboxData = await inboxModel.getMessageFromAccountId(account_id)
  const archive = await inboxModel.messageArchived(message_id)
  const archived_messages = await inboxModel.getArchivedMessagesByAccountId(res.locals.accountData.account_id)
  // console.log(archived_messages)
  const table = await utilities.archived(inboxData)
  res.render(`inbox/archive`, {
    title: firstname + " " + lastname + "'s " +  "Archives",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname : firstname,
    account_lastname : lastname,
    table,
    archived_messages: archived_messages[0].count,
    archive

  })
}



module.exports = { buildInboxView, buildMessageView, buildReplyView, createNewMessageView, sendNewMessage, reply, markAsRead
  , deleteMessage
  , archivedMessages
  , archiveMessage
}