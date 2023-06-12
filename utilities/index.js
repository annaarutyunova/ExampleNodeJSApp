const invModel = require("../models/inventory-model")
const Util = {}

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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
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
Util.selectClassification = async function(data) {
  let select = "<select name='classification_id' class='semi-bold'>"
  for(let i=0; i < data.length; i++){
    select += `<option class="regular" value="${data[i].classification_id}">${data[i].classification_name}</option> `
  }
  select += "</select>"
  return select
}

// Util.selectClassification = async function(optionSelected){
//   let data = await invModel.getClassifications()
//   let options = "<option value=''>Choose a Classification</option>"
//   data.rows.forEach((row) => {
//     options += `
//     <option
//       value = "${row.classification_id}"
//       ${row.classification_id === Number(optionSelected)? 'selected':''}
//       >
//       ${row.classification_name}
//     </option>`
//   })
//   return options
// }



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;