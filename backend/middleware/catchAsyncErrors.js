module.exports = theFunc => (req, res, next) => {
    //It is like try and catch function 
    Promise.resolve(theFunc(req, res, next))
        .catch(next);
};