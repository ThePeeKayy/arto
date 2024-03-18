import bcrypt from 'bcrypt';
import {Pool} from 'pg';
import crypto from 'crypto'
const encodedPassword = encodeURIComponent(process.env.POSTGRES_PASSWORD)
const db = new Pool({
    connectionString:`postgres://postgres.iqcfagvphwzdefttsyfe:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
});

async function getUserById(id) {
  const query = 'SELECT * FROM artousers WHERE id = $1';
  const values = [id];
  const result = await db.query(query, values);
  const data = result.rows[0]; 
  return data
}

async function getUserByEmail(email) {
    const query = 'SELECT * FROM artousers WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);
    const data = result.rows[0];
    return data
}

async function getUserByName(name) {
  const query = 'SELECT * FROM artousers WHERE username = $1';
  const values = [name];
  const result = await db.query(query, values);
  const data = result.rows[0];
  return data
}
  
  async function createUser(email, password, username,image) {
    const hashedpassword = password ? await bcrypt.hash(password, 10) : null;
    const userId = crypto.randomBytes(16).toString('hex');
    const query = 'INSERT INTO artousers (id, email, hashedpassword, username, image) VALUES ($1, $2, $3, $4,$5) RETURNING *;';
    const values = [userId, email, hashedpassword, username,image];
    const result = await db.query(query, values);
    return result.rows[0];
}

async function updateUserLastLogin(userId,imageURL) {
    try {
      await db.query('UPDATE artousers SET last_login = NOW() WHERE id = $1', [userId]);
      console.log(`User with ID ${userId} last login updated successfully.`);
    
      await db.query ('UPDATE artousers SET image = $1 WHERE id = $2',[imageURL,userId])
      console.log(`User with ID ${userId} image updated successfully.`);
  
    } catch (error) {
      console.error(`Error updating last login for user with ID ${userId}:`, error);
    }
}

async function createNewListing(title, description, price, category, imgUrls, username,qtyavail) {
  const productId = crypto.randomBytes(2).toString('hex');
  try {
    const base64Images = imgUrls.map(base64String => {
      const paddedBase64String = padBase64(base64String);
      return paddedBase64String;
    });
    

    await db.query('INSERT INTO listings (title, description, price, category, imgurls, author,qtyavail,productid) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)', [title, description, price, category, base64Images, username,qtyavail,productId]);
    console.log('New listing inserted successfully.');
  } catch (error) {
    console.error('Error inserting new listing:', error);
    throw error; 
  }
}

async function deleteListing(id) {
  try{
    await db.query('DELETE FROM listings WHERE productid=$1',[id])
    console.log(`Listing deleted successfully.`);
  } catch(err) {
    console.log(err)
  }
}

async function editListing(title,description,price,category,imgUrls,username,id,qtyavail) {
  const base64Images = imgUrls.map(base64String => {
    const paddedBase64String = padBase64(base64String);
    return paddedBase64String;
  });
  try{
    await db.query('UPDATE listings SET title = $1, description = $2, price=$3, category=$4, imgurls=$5, author = $6, qtyavail=$8  WHERE productid = $7',[title,description,price,category,base64Images,username,id,qtyavail])
  } catch(err) {
    console.log(err)
  }
}

function padBase64(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  return base64String + padding;
}

async function fetchProducts(query, category) {
  let queryString = 'SELECT * FROM listings';

  if (query && category) {
    queryString += ' WHERE (LOWER(listings.title) LIKE $1 OR LOWER(listings.author) LIKE $1) AND LOWER(listings.category) LIKE $2';
    const result = await db.query(queryString, [`%${query.toLowerCase()}%`, `%${category.toLowerCase()}%`]);
    return result.rows;
  }
  
  if (query) {
    queryString += ' WHERE LOWER(listings.author) LIKE $1 OR LOWER(listings.title) LIKE $1';
    const result = await db.query(queryString, [`%${query.toLowerCase()}%`]);
    return result.rows;
  }

  if (category) {
    queryString += ' WHERE LOWER(listings.category) LIKE $1';
    const result = await db.query(queryString, [`%${category.toLowerCase()}%`]);
    return result.rows;
  }

  const result = await db.query(queryString);
  return result.rows;
}

async function fetchProduct(productid) {
  const result = await db.query('SELECT * FROM listings WHERE productid = $1;',[productid])
  return result.rows[0];
}

async function addToken(userId,token) {
  await db.query('INSERT INTO user_tokens (user_id, token) VALUES ($1,$2)',[userId,token])
}

async function updateToken(userId, token) {
  await db.query('UPDATE user_tokens SET token = $1 WHERE user_id = $2',[token,userId])
}

async function getToken(userId) {
  const result = await db.query('SELECT token FROM user_tokens WHERE user_id = $1',[userId])
  return result.rows[0]
}

export {db, getUserById, addToken,updateToken,getToken, createUser,getUserByEmail,getUserByName,updateUserLastLogin, createNewListing, deleteListing, editListing, fetchProducts,fetchProduct }