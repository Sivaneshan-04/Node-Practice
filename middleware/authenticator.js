
module.exports = (req,res,next)=>{
    if(!req.session.isLogin){
        console.log('Users is not logged in');
        return res.redirect('/login');
    }
    next();
}