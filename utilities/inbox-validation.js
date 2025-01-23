const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inboxModel = require("../models/inbox-model")
// const inboxtModel = require("../models/inbox-model")

validate.inboxRules = () => {
    return [
        body("account_id")
            .trim()
            .isNumeric()
            .withMessage("Select who you want to send email to."),
        body("message_body")
          .trim()
          .isLength({min: 1})
          .withMessage("The message can't be empty"),
        body("message_subject")
          .trim()
          .isLength({ min: 1 })
          .withMessage("Please include subject."),
      ]
    }
  
  
    /* ******************************
   * Check data and return errors or continue to login
   * ***************************** */
  validate.checkInboxData = async (req, res, next) => {
      const { message_subject, message_body, account_id } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let select = await utilities.selectEmail((account_id))
        let nav = await utilities.getNav()
        res.render("inbox/create-message", {
          errors,
          title: "New Message",
          nav,
          select,
          message_subject, 
          message_body
        })
        return
      }
      next()
    }

validate.checkReply = async (req, res, next) => {
  const { message_subject, message_body } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let select = await utilities.selectEmail()
    res.render("inbox/reply", {
      errors,
      title: "Reply Message",
      nav,
      select,
      message_subject, 
      message_body
    })
    return
  }
  next()
}



module.exports = validate