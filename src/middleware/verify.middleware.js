const errorType=require('../constants/errorType');
const {getCpatcha}=require("../controller/captcha.controller");
const {
    getUserNameService
}=require('../service/user.service')
async function registerVerify(ctx,next)
{
    const {userName,password,code}=ctx.request.body;
    console.log(userName,password)
    if(!userName||!password||userName.trim()===''||password.trim()==='')
    {
        const err=new Error(errorType.USER_NAME_OR_PASSWORD_IS_NOT_NULL);
        return ctx.app.emit('error',err,ctx)
    };
    const cpatcha=getCpatcha();
    let text=cpatcha.text;
    if(text!==code){
       const err=new Error(errorType.VERIFICATION_CODE_ERROR);
       return ctx.app.emit('error',err,ctx);
    }
    const result=await getUserNameService(userName);
    if(result.length!==0)
    {
        const err=new Error(errorType.USER_ALREADY_EXISTS);
        return ctx.app.emit('error',err,ctx);
    }
    await next();  
}
async function loginVerify(ctx,next)
{
    const {userName,password}=ctx.request.body;
    //console.log(ctx.request.body)
    if(!userName||!password||userName.trim()===''||password.trim()==='')
    {
        const err=new Error(errorType.USER_NAME_OR_PASSWORD_IS_NOT_NULL);
        return ctx.app.emit('error',err,ctx)
    }
    const result=await getUserNameService(userName)
    //用户不存在
    if(result.length===0)
    {
        const err=new Error(errorType.USER_NAME_OR_PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error',err,ctx);
    }
    const user=result[0];
    //密码错误
    if(user.password!==password)
    {
        const err=new Error(errorType.USER_NAME_OR_PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error',err,ctx);
    }
    ctx.user={
        userId:user.userId,
        userName:user.userName,
        avatarUrl:user.avatarUrl,
        auth:user.auth
    }
    await next();
}
module.exports={
    registerVerify,
    loginVerify
}