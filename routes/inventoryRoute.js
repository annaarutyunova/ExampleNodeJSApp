// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/throwError", utilities.handleErrors(invController.throwError));
router.get("/management", utilities.handleErrors(invController.buildManagement))

router.get("/add-classification", utilities.handleErrors(invController.buildAddClass))
router.post(
    "/add-classification",
    invValidate.newClassificationRules(),
    invValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClass)
    )

router.get("/new-vehicle", utilities.handleErrors(invController.buildNewVehicle))

module.exports = router;