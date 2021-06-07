const Router=require('koa-router');
const dynamicRouter=new Router({prefix:"/dynamic"});
const {
    authVerify
}=require("../middleware/auth.middleware");
const {
    getUserFollow
}=require("../controller/dynamic.controller")
//获取用户关注用户
dynamicRouter.post("/user",authVerify,getUserFollow)
module.exports=dynamicRouter;