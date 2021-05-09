const Router=require('koa-router');
const chatRouter=new Router();
const {
  create
}=require("../controller/chat.controller");
const {
  authVerify
}=require("../middleware/auth.middleware")
chatRouter.all("/",create);
module.exports=chatRouter;