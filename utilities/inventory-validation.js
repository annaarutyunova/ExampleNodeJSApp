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
            .withMessage("Cannnot add an empty field. Please provide classification.")
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
  
// Server side validation for Add New Vehicle 
validate.addNewVehicleRules = () => {
  return [
    // inv_make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."), // on error this message is sent.
  // inv_model is required and must be string
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model."), // on error this message is sent.
  // Description is required and cannot already exist in the DB
    body("inv_description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide some description."),  
    body("inv_price")
      .trim()
      // .isNumeric()
      .matches(/^\d+([.]\d+)?$/)
      .withMessage("Please provide vehicle price."),
    body("inv_year")
      .trim()
      .matches(/^\d{4}$/)
      .withMessage("Please provide valid vehicle year."),
    body("inv_miles")
      .trim()
      .matches(/^\d+([.]\d+)?$/)
      .withMessage("Please provide vehicle mileage."),
    body("inv_color")
      .trim()
      .matches(/[A-Za-z]{3,}/)
      .withMessage("Please provide vehicle color.")
  ]
}

validate.checkNewVehicleData = async (req, res, next) => {
    const { 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image,
      inv_thumbnail,
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationData = await invModel.getClassifications()
      let select = await utilities.selectClassification(classificationData.rows)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Vehicle",
        nav,
        select,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image,
        inv_thumbnail,
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color
      })
      return
    }
    next()
}


  module.exports = validate