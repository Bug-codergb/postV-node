const errorType=require("../constants/errorType")
const {
    getChannelByUserService
}=require("../service/channel.service");
const {
    getUserMsgByIdService
}=require("../service/user.service")
const delChanelAuth=async (ctx,next)=>{
    const {userId}=ctx.user;
    const {id}=ctx.query;
    const res=await getUserMsgByIdService(userId);
    const {auth}=res[0];
    if(auth===1){
        next()
    }
    else{
        const result=await getChannelByUserService(id,userId);
        if(result.length===0){
            const err=new Error(errorType.NO_PERMISSION_TO_MODIFY);
            return ctx.app.emit("error",err,ctx);
        }else{
            next()
        }
    }
}
module.exports= {
    delChanelAuth
}