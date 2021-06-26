const connection=require("../app/database");
class MessageService{
    //获取所有未读聊天信息
    async getAllMsgService(userId){
      const sql=`
      select id,chat.userId,chat.userName,avatarUrl,JSON_ARRAYAGG(JSON_OBJECT(
      'content',content,'createTime',chat.createTime
      )) as content
      from chat
      LEFT JOIN user on user.userId=chat.userId
      where sideId=? and isOnline=0
      GROUP BY chat.userId`;
      const result=await connection.execute(sql,[userId]);
      return result[0];
    }
    //已读消息
    async readMsgService(userId){
        try{
            const sql=`update chat set isOnline=1 where userId=?`;
            const result=await connection.execute(sql,[userId]);
            return result[0];
        }catch(e){
            console.log(e)
        }
    }
}
module.exports=new MessageService();