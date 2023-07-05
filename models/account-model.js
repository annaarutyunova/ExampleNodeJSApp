const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check if updated email matches emails of other accounts
 * ********************* */
async function checkMatchingEmails(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email != $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}



/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountDataById(account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account data
* ***************************** */
async function updateAccountData(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

async function updatePassword(account_password, account_id){
  try{
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch(error){
    return error.message
  }
}

// Return data from the join between message and account tables for the inbox.
async function getMessageFromAccountId(account_id) {
  try {
    const result = await pool.query(
      "SELECT message_id, message_subject, message_body, TO_CHAR(message_created, 'YYYY-MM-DD HH24:MI:SS') AS message_created, message_to, message_from, message_read, message_archived, account_firstname, account_lastname FROM public.account JOIN public.message ON account_id = message_to WHERE message_to = $1",
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No messages found")
  }
}

// Return message data based on message_id
async function  getMessageByMessageId(message_id) {
  try {
    const result = await pool.query(
      "SELECT message_id, message_subject, message_body, TO_CHAR(message_created, 'YYYY-MM-DD HH24:MI:SS') AS message_created, message_to, message_from, message_read, message_archived, account_firstname, account_lastname FROM public.message JOIN public.account ON message_from = account_id WHERE message_id = $1",
      [message_id])
      console.log(result.rows)
    return result.rows
  } catch (error) {
    return new Error("No messages found")
  }
}


  module.exports = {registerAccount, checkExistingEmail, checkMatchingEmails, getAccountByEmail, getAccountDataById, updateAccountData, updatePassword, getMessageFromAccountId, getMessageByMessageId};