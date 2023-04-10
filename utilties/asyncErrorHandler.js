
module.exports = asyncError => {

    return(req,res,next) =>
    {
        asyncError(req, res, next).catch(next);
    }
}