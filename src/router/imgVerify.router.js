const Router=require('koa-router');
const captchaRouter=new Router();
const {
  create
}=require("../controller/captcha.controller")
captchaRouter.get("/getimgCode",create)
module.exports=captchaRouter;
