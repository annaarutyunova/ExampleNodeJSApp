const pool = require("../database/")

// Return data from the join between message and account tables for the inbox.
async function getMessageFromAccountId(account_id) {
    try {
        const result = await pool.query(
        "SELECT message_id, message_subject, message_body, TO_CHAR(message_created, 'YYYY-MM-DD HH24:MI:SS') AS message_created, message_to, message_from, message_read, message_archived, account_firstname, account_lastname FROM public.account JOIN public.message ON account_id = message_to WHERE message_to = $1 ORDER BY message_created DESC",
        [account_id])

        return result.rows
    } catch (error) {
        return new Error("No messages found")
    }
}

// Return message data based on message_id
async function getMessageByMessageId(message_id) {
    try {
        const result = await pool.query(
        "SELECT message_id, message_subject, message_body, TO_CHAR(message_created, 'YYYY-MM-DD HH24:MI:SS') AS message_created, message_to, message_from, message_read, message_archived, account_firstname, account_lastname, account_email FROM public.message JOIN public.account ON message_from = account_id WHERE message_id = $1 ORDER BY message_created DESC",
        [message_id])
        return result.rows
    } catch (error) {
        return new Error("No messages found")
    }
}

async function getAccountId(){
    return await pool.query("SELECT account_id, account_email, account_firstname, account_lastname FROM public.account ORDER BY account_email")
}

async function sendMessage(
   account_id, message_from, message_subject, message_body
  ) {
    try {
      const sql =
        "INSERT INTO public.message (message_to, message_from, message_subject, message_body) VALUES ($1, $2, $3, $4) RETURNING *"
      const data = await pool.query(sql, [
        account_id, message_from, message_subject, message_body
      ])
      return data.rows[0]
    } catch (error) {
      console.error("send message inbox-model error: " + error)
    }
  }
  
async function markAsRead(message_id){
  try{
    const sql = "UPDATE message SET message_read = 'true' WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch(error){
    console.error("markeAsRead() in inbox-model" + error)
    return error.message
  }
}

async function deleteMessage(message_id){
  try{
    const sql = "DELETE FROM message WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  }catch(error){
    console.error("deleteMessage() in inbox-model" + error)
    return error.message
  }
}

async function messageArchived(message_id){
  try{
    const sql = "UPDATE message SET message_archived = 'true' WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch(error){
    console.error("markeAsRead() in inbox-model" + error)
    return error.message
  }
}

  

  
module.exports = {getMessageFromAccountId, getMessageByMessageId, getAccountId, sendMessage, markAsRead, deleteMessage, messageArchived};