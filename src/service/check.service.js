const connection =require('../app/database');
class CheckService{
  async getAllCheckService()
  {
    try{
      const sql=
      `select momentId,title,content,moment.updateTime,
      JSON_OBJECT('userId',user.userId,'userName',user.userName) as user
       from moment
      LEFT JOIN user on moment.userId=user.userId
       where status=0`;
    const result=await connection.execute(sql);
    return result[0];
    }catch(e)
    {
      console.log(e)
    }
  }
}
module.exports=new CheckService()