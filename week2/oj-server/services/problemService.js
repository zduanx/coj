const ProblemModel = require('../models/problemModel');

const getProblems = function(){
  console.log('In the problem service get problems')
  // return new Promise((resolve, reject) =>{
  //     resolve(problems);
  // });
  return new Promise((resolve, reject) => {
    // find (condition, callback)
    ProblemModel.find({}, function(err, data){
      if(err){
        reject(err);
      } else{
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
  return new Promise((resolve, reject) =>{
    ProblemModel.findOne({name: newProblem.name}, (err, data) =>{
      if(data){
        reject('Problem already exists');
      } else{
        ProblemMode.count({}, (err, count) =>{
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

// const problems = [
//     {
//       id: 5,
//       name: "Sliding Window Maximum",
//       desc: `Given an array of n integer with duplicate number, and a moving window(size k), move the window at each iteration from the start of the array, find the maximum number inside the window at each moving.`,
//       difficulty: "super"
//     }
// ];