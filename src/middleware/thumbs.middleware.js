const { authVerify } = require("./auth.middleware")
const errorType=require('../constants/errorType.js')
const { getThumbByUserId}=require('../service/thumbs.service');
async function thumbAuthVerify(ctx,next)
{
    const {id}=ctx.query;
    const {userId}=ctx.user;
    const result=await getThumbByUserId(userId);
    //console.log(result)
    if(result.length===0)
    {
        const err=new Error(errorType.NO_PERMISSION_TO_MODIFY);
        return ctx.app.emit('error',err,ctx);
    }
    const isExist=result.some((item,index)=>{
        return item.commentId===id||item.momentId===id
    })
    if(isExist)
    {
        const index=result.findIndex((item,index)=>{
            return item.momentId===id;
        })
        if(index!==-1)
        {
            ctx.source={
                momentId:id
            }
        }
        else{
            ctx.source={
                commentId:id
            }
        }
        await next()
    }
    else{
        const err=new Error(errorType.NO_PERMISSION_TO_MODIFY);
        return ctx.app.emit('error',err,ctx);
    }
}
module.exports={
    thumbAuthVerify
}