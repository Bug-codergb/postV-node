const Router=require('koa-router');
const chatRouter=new Router();
const {
  create,
  getAllChatMsg
}=require("../controller/chat.controller");
chatRouter.all("/",create);
chatRouter.get("/chat/all",getAllChatMsg)
module.exports=chatRouter;