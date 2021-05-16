const connection =require("../app/database.js");
class ChatService
{
  async createService(userId,userName,content,sideId,sideName)
  {
    const id=new Date().getTime();
    const sql=`insert into chat(id,userId,userName,content,sideId,sideName) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,userId,userName,content,sideId,sideName]);
    return result[0]
  }
  //获取所有聊天记录
  async getAllChatMsgService(userId,sideId)
  {
    const sql=`select chat.id,content,JSON_OBJECT('userId',chat.userId,'userName',chat.userName,'avatarUrl',avatarUrl) as user
    from chat
    LEFT JOIN user on user.userId=chat.userId
    where (chat.userId=? and chat.sideId=?) or (chat.userId=? and chat.sideId=?)
    order by chat.createTime asc`;
    const result=await connection.execute(sql,[userId,sideId,sideId,userId]);
    return result[0];
  }
}
module.exports=new ChatService(); 