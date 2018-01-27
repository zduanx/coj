const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

const clientErrorCheck = require('../middleware/clientErrorCheck');
const expressJwt = require('express-jwt');
const jwtCheck = expressJwt({
    secret: require('auth0-api-jwt-rsa-validation')(),
    // issuer: `apocalypse.auth0.com/`,
    issuer: `https://apocalypse.auth0.com/`,
    algorithms: ['RS256']
});

EXECUTOR_SERVER_URL = 'http://localhost:5000/buildresults';

restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

// get problems
// no /vpi/v1 
router.get('/problems', (req, res) =>{
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// get problem
router.get('/problems/:id', (req, res) =>{
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});
// post problem

router.post('/problems', jsonParser, (req, res) =>{
    problemService.addProblem(req.body)
        .then((problem) => {
            res.json(problem);
        },
        (error) => {
            res.status(400).send('Problem name already exists!');
        });
});

// export all modules
// add jwtCheck middleware, validate header Authorization: 'Bearer ${id_token}', append req.body.user = auth.user
// if jwtCheck fails, use clientErrorCheck error -handling middleware append req.body.user = {}
// this is used to identify who send the request & block unauthorized access
router.post('/buildresults', [jsonParser, jwtCheck, clientErrorCheck], (req, res)=> {
    if(!req.user.name){
        res.status(403).send('Not Authorized access');
        return;
    }
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;
    // console.log('lang; ', lang, 'usercode: ', userCodes);
    
    restClient.methods.build_and_run(
        {
            data: {code: userCodes, lang: lang},
            headers: {'Content-Type': 'application/json'}
        },
        (data, response) =>{
            // {build: ,run:}
            const buildtext = `Build output: ${data['build']}`;
            const runtext = `Execute output: ${data['run']}`;
            data['buildtext'] = buildtext;
            data['runtext'] = runtext;
            res.json(data);
        }
    );
})

module.exports = router;
