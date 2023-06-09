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