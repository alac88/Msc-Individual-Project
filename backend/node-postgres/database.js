const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imperial',
  password: 'testdb',
  port: 5432,
});
const TABLE = "project"

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n > 0;
}

function getAllApps(page, rating){
  if (page != null){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${100} OFFSET ${page * 100}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  } else {
      return new Promise(function(resolve, reject) {
        pool.query(`SELECT * FROM ${TABLE} WHERE "RATINGS">${rating} ORDER BY "ID" ASC`, (error, results) => {
          if (error) {
            console.log("Erreur: ", error);
            reject(error)
          }
          if (results){
            resolve(results.rows);
          }
        })
      }) 
  }
}

function getAppsByName(page, name, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${100} OFFSET ${page * 100}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  }
}

function getAppsByCategory(page, category, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE "CATEGORY"='${category}' AND "RATINGS">${rating}ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${100} OFFSET ${page * 100}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  }
}

function getSomeApps(page, rating, max){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM ${TABLE} WHERE "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      if (results){
        resolve(results.rows);
      }
    })
  }) 
}

function getAppsByNameAndCategory(page, name, category, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${100} OFFSET ${page * 100}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        if (results){
          resolve(results.rows);
        }
      })
    }) 
  }
}
const getApps = (page, name, category, rating, max) => {

  if ((name != null) && (category != null) && (name != '') && (category != '')) {
    return getAppsByNameAndCategory(page, name, category, rating, max);
  } else if ((name != null) && (name != '')) {
    return getAppsByName(page, name, rating, max);
  } else if ((category != null) && (category != '')) {
    return getAppsByCategory(page, category, rating, max);
  } else if (max && isNormalInteger(max)) {
    return getSomeApps(page, rating, max);
  } else {
    return getAllApps(page, rating);
  }
}

function getAppsCount(){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT COUNT(*) FROM ${TABLE}`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      if (results){
        resolve(results.rows);
      }
    })
  }) 
}

const getCategories = () => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT "CATEGORY" as "name", COUNT(*) as "value" FROM ${TABLE} WHERE "CATEGORY" IN (SELECT DISTINCT "CATEGORY" FROM ${TABLE}) GROUP BY "CATEGORY";`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      if (results){
        resolve(results.rows);
      }
    })
  }) 
}

module.exports = {
  getApps,
  getAppsCount,
  getCategories,
}