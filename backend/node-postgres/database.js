const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'imperial_db',
  password: 'testdb',
  port: 5432,
});

function getAllApps(){
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM public.test3 ORDER BY "ID" ASC`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByName(name, max = 0){
  if (max){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') ORDER BY "ID" ASC`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
}

function getAppsByCategory(category, max = 0){
  if (max){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE "CATEGORY"='${category}' ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE "CATEGORY"='${category}' ORDER BY "ID" ASC`, (error, results) => {
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
    pool.query(`SELECT * FROM public.test3 ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
      if (error) {
        console.log("Erreur: ", error);
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

function getAppsByNameAndCategory(name, category, max = 0){
  if (max){
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' ORDER BY "ID" ASC LIMIT ${max}`, (error, results) => {
        if (error) {
          console.log("Erreur: ", error);
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  } else {
    return new Promise(function(resolve, reject) {
      pool.query(`SELECT * FROM public.test3 WHERE ("NAME_APP" LIKE '%${name}%' OR "PACKAGE_NAME" LIKE '%${name}%') AND "CATEGORY"='${category}' ORDER BY "ID" ASC`, (error, results) => {
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
    if (max != '') {
      return getAppsByNameAndCategory(name, category, max);
    } else {
      return getAppsByNameAndCategory(name, category);
    }
  } else if ((name != null) && (name != '')) {
    if (max != '') {
      return getAppsByName(name, max);
    } else {
      return getAppsByName(name);
    }
  } else if ((category != null) && (category != '')) {
    if (max != '') {
      return getAppsByCategory(category, max);
    } else {
      return getAppsByCategory(category);
    }
  } else if ((max != null) && (max != '') && (max != '0')) {
    console.log("hello");
    return getSomeApps(max);
  } else {
    return getAllApps();
  }
}

const getAppByPackageName = (packageName) => {
  return new Promise(function(resolve, reject) {
    pool.query(`SELECT * FROM public.test3 WHERE "PACKAGE_NAME"='${packageName}'`, (error, results) => {
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
}