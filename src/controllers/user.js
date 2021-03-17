const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator')
const db = require('./db')
const jwt = require('../services/jwt')
const uniqid = require('uniqid')
const md5 = require('md5')
const helpersHttp = require('../helpers/http')
const userQuerys = require('../queries/user');
const { response } = require('express')

class UserController{

  constructor(){
  }

  getResponse = ()=>{
    return {
      status: 200,
      data: [],
      error: []
    }
  }

  signin = async (req,res) => {

    const response = this.getResponse();
    try {

      let {email, password} = req.body;
      let profile = await db.asyncQuery(userQuerys.getUsersByEmail, [email]);

      if(profile.length) {
        profile = profile[0];
        //Comparo las passwords
        await new Promise((resolve,reject) =>{
          bcrypt.compare(password, profile.password, async (err, check) => {
            
            if(err) {
              response.status = 500;
              response.error.push('GENERAL_ERROR')
              resolve();
            }
  
            else {

              //Si el password es correcto
              if(check) {
                const user = profile;
                profile.password = undefined;
                profile.status = undefined;

                response.data.push({
                  'token': jwt.createToken(user),
                  'profile': profile
                });
              }
              //Si no
              else {
                response.status = 403;
                response.error.push('INCORRECT_PASSWORD')
              }
              
              resolve();
            }
  
          })
        })

      }
      else {
        response.status = 404;
        response.error.push('INVALID_USER')
      }

    }catch(error){
      if(response.status == 200){
        response.status = 500;
        response.error = error;
      }
    }finally{
      res.status(response.status).send(response);
    }
  }

  signup = async (req,res) => {
    
    let response = this.getResponse();

    try {
      let {email, password, name} = req.body;
      let rs = await db.asyncQuery(userQuerys.getUsersByEmail, [email]);

      if(rs.length){
        response.status = 403;
        response.error = "ALREADY_EXIST_EMAIL"
      }
      
      await new Promise((resolve,reject)=>{
        bcrypt.hash(password, null, null, (err, hash) => {
          if(err) {
            reject('PASSWORD_INVALID');
          }else{
            password = hash
            resolve();
          }
        })
      });

      rs = await db.asyncQuery(userQuerys.insertUser,[email,password,name]);

      response.data = {
        id: rs.insertId,
        email,
        name,
        status: 1
      }

    }catch (error){
      if(response.status == 200){
        response.status = 500;
        response.error = error;
      }
    }finally{
      res.status(response.status).send(response);
    }
  }

  getStats = async (req,res)=>{
    const response = this.getResponse();

    try {
      let date = new Date();
      
      let listTask = await db.asyncQuery(userQuerys.getUsersStats, [req.user.sub]);

      let total = listTask.length;
      let finish = 0;
      let finishMonth = 0;
      let finishDay = 0;
      
      for(let task of listTask){
        //Finalizado
        if(task.date_finish){
          finish++;
          task.date_finish = new Date(task.date_finish);
          //Si son del mismo mes
          if(task.date_finish.getMonth() == date.getMonth()){
            finishMonth++;
          }

          if(
            `${task.date_finish.getDate()}/${task.date_finish.getMonth()}/${task.date_finish.getFullYear}` == 
            `${date.getDate()}/${date.getMonth()}/${date.getFullYear}`){
              finishDay++;
          }
        }
      }

      response.data = {
        total,
        finish: {
          total: finish,
          month: finishMonth,
          day: finishDay
        }
      }


    } catch (error) {
      console.log(error)
      if(response.status == 200){
        response.status = 500;
        response.error = error;
      }
    } finally{
      res.status(response.status).send(response);
    }
  }

}

module.exports = new UserController();
