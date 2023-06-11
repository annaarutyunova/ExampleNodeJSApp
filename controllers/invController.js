const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInvId = async function(req, res, next){
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const div = await utilities.buildInvView(data);
  let nav = await utilities.getNav()
  res.render("./inventory/inventory",{
    title: "vehicles",
    nav, 
    div,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/management",{
    title: "Management",
    nav, 
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClass = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification",{
    title: "Add Classification",
    nav, 
    errors: null,
  })
}

 /* ****************************************
*  Process Add New Classification
* *************************************** */
invCont.addNewClass = async function(req, res) {
  const { classification_name } = req.body

  const newVehicleResult = await invModel.addNewClass(
    classification_name
  )
  if (newVehicleResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Please provide a correct classification name.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification ",
      nav,
      errors
    })
  }
}

/* ***************************
 *  Build add buildNewVehicles
 * ************************** */
invCont.buildNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory",{
    title: "Add Vehicle",
    nav, 
    errors: null,
  })
}

 /* ****************************************
*  Process Add New Vehicle
* *************************************** */
invCont.buildNewVehicleForm = async function(req, res) {
  let nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications()
  let select = await utilities.selectClassification(classificationData.rows)
  res.render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        select,
        errors: null,
      })
}

invCont.addNewVehicle = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_year, inv_miles, inv_color} = req.body
    // Need to build invMode.buildNewVehicleForm
    const newVehicleResult = await invModel.addNewVehicle(
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
      classification_id
    )
    if (newVehicleResult) {
      const classificationData = await invModel.getClassifications()
      let select = await utilities.selectClassification(classificationData.rows)
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} was successfully added.`
      )
      res.status(201).render("./inventory/add-inventory", {
        title: "Add Classification",
        nav,
        errors: null,
        select
      })
    } else {
      req.flash("notice", "Please provide a correct information.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        errors,
        select
      })
    }


}



/* ***************************
 *  Error
 * ************************** */
invCont.throwError = async function(req, res, next){
try{
  throw new Error("Made up error")
}catch(error){
  next(error)
}
}

module.exports = invCont