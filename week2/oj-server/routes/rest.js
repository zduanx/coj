const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');

// get problems
// no /vpi/v1 
router.get('/problems', (req, res) =>{
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// get problem

// post problem

// export all modules
module.exports = router;