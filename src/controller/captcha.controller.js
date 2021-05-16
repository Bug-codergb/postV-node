const {
  getCode
}=require("../utils/getCode");
let code=null;
class CaptchaController{
  async create(ctx,next){
    let cpatcha=getCode();
    code=cpatcha;
    ctx.set('content-type','image/svg+xml')
    ctx.body=cpatcha.data;
  }
  getCpatcha(){
    return code;
  }
}
module.exports=new CaptchaController();