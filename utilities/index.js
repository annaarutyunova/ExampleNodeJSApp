const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const inboxModel = require("../models/inbox-model")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="semi-bold">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice semi-bold">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInvView = async function(data){
  let div
  if(data.length > 0){ 
    div = '<h1 id="invName" class="bold">' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model  + '</h1>'
    div += '<div id="invInfoWithImg">'+ '<img id="car" src="' + data[0].inv_image + '"' + '" alt="Image of '+ data[0].inv_make 
    + ' ' + data[0].inv_model 
    +' on CSE Motors" />'
    div += '<div id="invInfo"><h2 class="semi-bold">' + data[0].inv_make + ' ' + data[0].inv_model + 
    '</h2><p class="semi-bold">Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
    div += '<p id="description" class="regular"><b>Description:</b> ' + data[0].inv_description + '</p>'
    div += '<p id="color" class="regular"><b>Color:</b> ' + data[0].inv_color + '</p>'
    div += '<p id="miles" class="regular"><b>Miles:</b> ' + new Intl.NumberFormat('en-Us').format(data[0].inv_miles) + '</p></div></div>'
  }
  else{
    div += "Sorry, no inventory details could be found."
  }
  return div
}



/* ************************
 * Constructs select classification in form in inventory when adding new vehicle
 ************************** */
Util.selectClassification = async function(optionSelected){
  let data = await invModel.getClassifications()
  let select = "<select name='classification_id' class='semi-bold' id='classificationList'>"
  let options = "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    options += `<option
      value = "${row.classification_id}"
      ${row.classification_id === Number(optionSelected)? 'selected':''}
      >
      ${row.classification_name}
    </option>`
  })
  select += options
  select += "</select>"
  return select
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}


/* ****************************************
* Middleware to check the account type
// **************************************** */
Util.checkAccountType = (req, res, next) => {
  // When not logged in you get redirected to the login page when trying to access /inv
  if(res.locals.loggedin){
    const account_type = res.locals.accountData.account_type;
  // Get account type from the payload which is accountData
    if (account_type == 'Employee' || account_type == 'Admin') {
      next() // where does it continue? what's the next step?
  } else {
    req.flash("notice", "You are not authorized to access this page.")
    res.status(403).redirect("/account/login")
  } 
} else {
  req.flash("notice", "You are not authorized to access this page.")
    res.status(403).redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Build the message table
Util.buildInbox = async function(data) {
  let table = '<table>'
  // Set up the table labels 
  let dataTable = '<thead class="semi-bold">'; 
  dataTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'; 
  dataTable += '</thead>'; 
  // Set up the table body 
  dataTable += '<tbody class="regular">'; 
  // Iterate over all vehicles in the array and put each in a row 
   data.forEach(function (message) {
  //  console.log(message.inv_id + ", " + message.inv_model); 
   dataTable += `<tr><td>${message.message_created}</td>`; 
   dataTable += `<td><a href='/inbox/message/${message.message_id}' title='Click to view'>${message.message_subject}</a></td>`; 
   dataTable += `<td>${message.account_firstname} ${message.account_lastname}</td>`; 
   dataTable += `<td>${message.message_read}</td></tr>`;  
  }) 
  dataTable += '</tbody></table>'; 
  // Display the contents in the Inventory Management view 
  return table += dataTable;
}

// Build the individual message view
Util.buildMessage = async function(data) {
  // Set up the table labels 
  let div = `<div class="message">`; 
   div += `<p class="regular"><strong><u>Subject:</u></strong> ${data[0].message_subject}</p><br>`; 
   div += `<p class="regular"><strong><u>From:</u></strong> ${data[0].account_firstname} ${data[0].account_lastname}</p><br>`; 
   div += `<p class="regular"><strong><u>Message:</u></strong></p><br><p class="regular">${data[0].message_body}</p></div>`;  
  return div;
}

Util.selectEmail = async function(optionSelected){
  const emails = await inboxModel.getAccountId()
  let select = "<select name='account_id' class='semi-bold' id='account_id'>"
  let option = "<option value=''>Send to</option>"
  emails.rows.forEach((row) => {
    option += `<option value = "${row.account_id}" ${row.account_id === Number(optionSelected)? "selected": ""}
    > ${row.account_email} </option> `
    console.log("Stupid accoutnid", row.account_id)
    console.log("option selected", optionSelected)
  })
  select += option
  select += "</select><br>"
  return select
}




module.exports = Util;