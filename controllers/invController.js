const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    // console.log("here");
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    // const className = data[0].classification_name
    const className = await invModel.getClassifcationNameById(classification_id);
    res.render("./inventory/classification", {
      title: className[0].classification_name + " vehicles",
      nav,
      grid,
      errors: null
    })
  } catch(error){
    console.log("Not sure what the try catch block should be")
  }
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
  const classificationSelect = await utilities.selectClassification()
  res.render("./inventory/management",{
    title: "Vehicle Management",
    nav, 
    errors: null,
    classificationSelect
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
      "success semi-bold",
      `The ${classification_name} classification was successfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle management",
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
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
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
        "success semi-bold",
        `The ${inv_make} ${inv_model} was successfully added.`
      )
      res.status(201).render("./inventory/management", {
        title: "Vehicle management",
        nav,
        errors: null,
        select
      })
    } else {
      req.flash("notice", "Please provide correct information.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        errors,
        select
      })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


// Activity 5 GET build the update view
invCont.editInventoryView = async function(req, res) {
  const inv_id = parseInt(req.params.inv_id)
  console.log(inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationData = await invModel.getClassifications()
  let select = await utilities.selectClassification(classificationData.rows)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        select : select,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id
      })
}

// Activity 5 POST
invCont.updateInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications()
  let select = await utilities.selectClassification(classificationData.rows)
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,
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
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash(
        "success semi-bold",
        `The ${itemName} was successfully updated.`
      )
      res.redirect("/inv/")
    } else {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("./inventory/edit-inventory", {
        title: "Edit" + itemName,
        nav,
        select: select,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
}

// Activity 5. Build the confirm deletion view. confirmDeleteInventoryView
invCont.confirmDeleteInventoryView = async function(req, res) {
  const inv_id = parseInt(req.params.inv_id)
  console.log(inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationData = await invModel.getClassifications()
  let select = await utilities.selectClassification(classificationData.rows)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        select: select,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price,
      })
}

// Activity 5 Delete Inventory
invCont.deleteInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, 
    inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    const deleteResult = await invModel.deleteInventory(
      inv_id,
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
    if (deleteResult) {
      const itemName = inv_make + " " + inv_model
      req.flash(
        "success semi-bold",
        `The ${itemName} was successfully deleted.`
      )
      res.redirect("/inv/")
    } else {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("./inventory/delete-confirm", {
        title: "Delete" + itemName,
        nav,
        select: select,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
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