const {
    getAllMsgService,
    readMsgService
}=require("../service/message.service");
let client=[];
class MessageController{
    async getAllMsg(ctx){
       try{
           client.push(ctx);
           const {userId}=ctx.query;
           const result=await getAllMsgService(userId);
           ctx.websocket.send(JSON.stringify(result));
       }catch(e){
           console.log(e);
       }
    }
    //已读消息
    async readMsg(ctx,next){
        try{
            const {userId}=ctx.request.body;
            console.log(userId)
            const result=await readMsgService(userId);
            ctx.body=result;
        }catch (e) {
            console.log(e)
        }
    }
}
module.exports=new MessageController();