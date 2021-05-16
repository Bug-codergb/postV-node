const {
  getUserMsgByIdService
}=require("../service/user.service");
const {
  createService,
  getAllChatMsgService
} =require("../service/chat.service")
const clients=[];
class ChatController{
  async create(ctx)
  {
    try{
      clients.push(ctx);
      const {userId,chatUserId}=ctx.query;
      const res=await getUserMsgByIdService(userId);
      const results=await getUserMsgByIdService(chatUserId);
      ctx.websocket.on("message",(message)=>{
        clients.forEach(async (item,index)=>{
          if(ctx.query.chatUserId===item.query.userId)
          {
            let result={
              content:message,
              user:res[0]
            }
            await createService(userId,res[0].userName,message,chatUserId,results[0].userName);
            item.websocket.send(JSON.stringify(result));
          }
        })
      })
      ctx.websocket.on('close',()=>{
        const isExists=clients.findIndex((item,index)=>{
           return ctx.query.userId===item.query.userId
        })

        if(isExists!==-1)        
        {
          clients.splice(isExists,1);
        }
      })
    }catch(e)
     {
        console.log(e);
      }
  }
  //获取用户聊天记录
  async getAllChatMsg(ctx,next)
  {
    const {userId,sideId}=ctx.query;
    const result=await getAllChatMsgService(userId,sideId);
    ctx.body=result;  
  }
}
module.exports=new ChatController();