const ProblemModel = require('../models/problemModel');

const getProblems = function(){
  console.log('In the problem service get problems')
  // return new Promise((resolve, reject) =>{
  //     resolve(problems);
  // });
  return new Promise((resolve, reject) => {
    // find (condition, callback)
    ProblemModel.find({}, (err, data) => {
      if(err){
        reject(err);
      } else{
        console.log(data);
        resolve(data);
      }
    });
  });
}

const getProblem = function(numId){
  console.log('In the problem service get single problem');
  return new Promise((resolve, reject)=>{
    ProblemModel.findOne({id: numId}, (err, data) =>{
      if(err){
        reject(err);
      } else{
        resolve(data);
      }
    });
  });
}

const addProblem = function(newProblem){
  console.log('In the add problem service');
  return new Promise((resolve, reject) =>{
    ProblemModel.findOne({name: newProblem.name}, (err, data) =>{
      if(data){
        reject('Problem already exists');
      } else{
        ProblemModel.count({}, (err, count) =>{
          newProblem.id = count + 1;
          const mongoProblem = new ProblemModel(newProblem);
          mongoProblem.save();
          resolve(mongoProblem);
        });
      }
    });
  });
}

module.exports = {
  getProblems,
  getProblem,
  addProblem
};
