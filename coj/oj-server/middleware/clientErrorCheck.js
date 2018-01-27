const set = require('lodash.set');
const middleware = (err, req, res, next) => {
    if(err){
        set(req, 'user', {});
    }
    next();
};

module.exports = middleware;;