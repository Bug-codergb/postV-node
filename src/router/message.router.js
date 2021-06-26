const Router=require('koa-router');
const messageRouter=new Router();
const {
    authVerify
}=require("../middleware/auth.middleware")
const {
    getAllMsg,
    readMsg
}=require("../controller/message.controller")
messageRouter.all("/message",getAllMsg);
messageRouter.post("/message/read",authVerify,readMsg);
module.exports=messageRouter;