const clients=[];
class ChatController{
  clients=[]
  async create(ctx)
  {
    try{
      //console.log(ctx.query);
      clients.push(ctx);
      ctx.websocket.send("i am server");
      ctx.websocket.on("message",(message)=>{
        clients.forEach((item,index)=>{
          if(item.query.chatUserId===ctx.query.userId)
          {
            item.websocket.send(message);
          }
        })
      })
    }catch(e)
     {
        console.log(e);
      }
  }
}
module.exports=new ChatController();