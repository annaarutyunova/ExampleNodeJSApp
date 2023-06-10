const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

 /*  **********************************
 *  Add New Classification Data Validation Rules
 * ********************************* */
 validate.newClassificationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
        body("classification_name")
            .trim()
            .isAlpha()
            .isLength({min: 1})
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification (classification_name)
                if (classificationExists){
                    throw new Error("That classification already exists. Please add a new classification.")
                }
        })
    ]
  }
  /* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  module.exports = validate