const Router=require('koa-router');
const userRouter=new Router({prefix:'/user'});
const {
    create,
    getMomentByUserId,
    follow,
    cancelFollow,
    getUserMsg,
    getRecUser
}=require('../controller/user.controller');
const {login}=require('../controller/login.controller')
const {
    registerVerify,
    loginVerify
}=require('../middleware/verify.middleware')
const {authVerify}=require('../middleware/auth.middleware')
userRouter.post('/register',registerVerify,create);
userRouter.post('/login',loginVerify,login);
//获取用户动态
userRouter.get('/moment',getMomentByUserId)
//关注用户
userRouter.post('/follow',authVerify,follow);
//取消关注
userRouter.post('/follow/cancel',authVerify,cancelFollow)
userRouter.get('/detail',getUserMsg)
//获取推荐用户
userRouter.get('/recommend',getRecUser)
module.exports=userRouter;