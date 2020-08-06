const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imperial',
  password: 'testdb',
  port: 5432,
});

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n > 0;
}

function getAllApps(){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM public.test4 ORDER BY "ID" ASC`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByName(name, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}

function getAppsByCategory(category, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE "CATEGORY"='${category}' ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE "CATEGORY"='${category}' ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}

function getSomeApps(max){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM public.test4 ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByNameAndCategory(name, category, max){
  if (max && isNormalInteger(max)){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test4 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}
const getApps = (name, category, max) => {

  if ((name != null) && (category != null) && (name != '') && (category != '')) {
    return getAppsByNameAndCategory(name, category, max);
  } else if ((name != null) && (name != '')) {
    return getAppsByName(name, max);
  } else if ((category != null) && (category != '')) {
    return getAppsByCategory(category, max);
  } else if (max && isNormalInteger(max)) {
    return getSomeApps(max);
  } else {
    return getAllApps();
  }
}

const getAppByPackageName = (packageName) => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM public.test4 WHERE "PACKAGE_NAME"='${packageName}'`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getCategories = (categoryName) => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT "CATEGORY", COUNT(*) FROM public.test4 WHERE "CATEGORY" IN (SELECT DISTINCT "CATEGORY" FROM public.test4) GROUP BY "CATEGORY";`, (error, results) => {
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
  getAppByPackageName,
  getCategories,
}