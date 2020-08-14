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

function getAllApps(rating){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM ${TABLE} WHERE "RATINGS">${rating} ORDER BY "ID" ASC`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByName(name, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "RATINGS">${rating} ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}

function getAppsByCategory(category, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE "CATEGORY"='${category}' AND "RATINGS">${rating}ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}

function getSomeApps(rating, max){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM ${TABLE} WHERE "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByNameAndCategory(name, category, rating, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM ${TABLE} WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' AND "RATINGS">${rating} ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}
const getApps = (name, category, rating, max) => {

  if ((name != null) && (category != null) && (name != '') && (category != '')) {
    return getAppsByNameAndCategory(name, category, rating, max);
  } else if ((name != null) && (name != '')) {
    return getAppsByName(name, rating, max);
  } else if ((category != null) && (category != '')) {
    return getAppsByCategory(category, rating, max);
  } else if (max && isNormalInteger(max)) {
    return getSomeApps(rating, max);
  } else {
    return getAllApps(rating);
  }
}

// const getAppByPackageName = (packageName, rating) => {
//   return new Promise(function(resolve, reject) {
//     pool.query(`SELECT * FROM ${TABLE} WHERE "PACKAGE_NAME"='${packageName}' AND "RATINGS">${rating}`, (error, results) => {
//       if (error) {
//         console.log("Erreur: ", error);
//         reject(error)
//       }
//       resolve(results.rows);
//     })
//   }) 
// }

const getCategories = () => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT "CATEGORY", COUNT(*) FROM ${TABLE} WHERE "CATEGORY" IN (SELECT DISTINCT "CATEGORY" FROM ${TABLE}) GROUP BY "CATEGORY";`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

module.exports = {
  getApps,
  // getAppByPackageName,
  getCategories,
}