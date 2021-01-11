/**
 * Helper method for ensuring users are authenticated when
 * trying to access resources that require auth throughout the application
 */
module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg' , 'Please login to view this resource!');
        res.redirect('/users/login');
    }
}