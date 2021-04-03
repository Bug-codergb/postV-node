const jwt=require('jsonwebtoken')
const errorType=require('../constants/errorType')
const {PUBLIC_KEY}=require('../app/config')
const {getUserByIdService}=require('../service/moment.service')
const {getUserMsgByIdService}=require('../service/user.service')
async function authVerify(ctx,next)
{
   const authorization=ctx.headers.authorization;
   if(!authorization)
   {
        const err=new Error(errorType.PERMISSION_DENIED);
        return ctx.app.emit('error',err,ctx)
   }
    const token=authorization.replace('Bearer ','');
   try{
       const result=jwt.verify(token,PUBLIC_KEY,{
           algorithms:['RS256']
       });
       ctx.user=result;
       await next();
   }catch (e){
        console.log(e)
       const err=new Error(errorType.PERMISSION_DENIED);
       return ctx.app.emit('error',err,ctx)
   }
}
//是否有修改权限
async function updateVerify(ctx,next)
{
    const {userId,userName}=ctx.user;
    const userMsg=await getUserMsgByIdService(userId);
    const {auth}=userMsg[0];
    if(auth===1)
    {
        await next();
    }
    else{
        const tableName=Object.keys(ctx.query)[0].replace('Id','')
        const field=Object.keys(ctx.query)[0];
        let source={
            tableName,
            field
        }
        const id=ctx.query[source.field];
        const result=await getUserByIdService(id,source,userId);
        if(result.length!==0&&result[0].userId===userId)
        {
            await next();
        }
        else if(result.length===0){
            const err=new Error(errorType.NO_PERMISSION_TO_MODIFY);
            return ctx.app.emit('error',err,ctx)
        }
    }
   
}
module.exports={
    authVerify,
    updateVerify
}