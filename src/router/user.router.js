const Router=require('koa-router');
const userRouter=new Router({prefix:'/user'});
const {
    create,
    getMomentByUserId,
    follow,
    cancelFollow,
    getUserMsg,
    getRecUser,
    getUserSub,
    getUserJoinTopic,
    setUserDesc
}=require('../controller/user.controller');
const {login}=require('../controller/login.controller')
const {
    registerVerify,
    loginVerify,
}=require('../middleware/verify.middleware')
const {authVerify}=require('../middleware/auth.middleware');
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
userRouter.get('/recommend',getRecUser);
//获取用户收藏
userRouter.get('/sub',getUserSub);
//获取用户已经加入的专题
userRouter.get('/topic/join',getUserJoinTopic);
//添加拥护简介
userRouter.post('/desc',authVerify,setUserDesc)
module.exports=userRouter;