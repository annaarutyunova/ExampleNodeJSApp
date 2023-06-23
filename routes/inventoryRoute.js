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
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClass))
router.post(
    "/add-classification",
    utilities.checkAccountType,
    invValidate.newClassificationRules(),
    invValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClass)
    )

router.get("/new-vehicle", utilities.checkAccountType, utilities.handleErrors(invController.buildNewVehicleForm))
// add router.post(invController.addNewVehicle)
router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.addNewVehicleRules(),
    invValidate.checkNewVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
    )

// Activity 5 Build a modify vehicle view when clicked on "modify"
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update/",
    utilities.checkAccountType,
    invValidate.addNewVehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
    )

// Activity 5 Delete
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.confirmDeleteInventoryView))
router.post("/delete/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
    )

module.exports = router;