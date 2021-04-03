const connection =require('../app/database');
class CheckService{
  async getAllCheckService()
  {
    try{
      const sql=
      `select momentId,title,content,moment.updateTime,status,
      JSON_OBJECT('userId',user.userId,'userName',user.userName) as user
       from moment
      LEFT JOIN user on moment.userId=user.userId
      ORDER BY moment.updateTime desc
      `;
    const result=await connection.execute(sql);
    return result[0];
    }catch(e)
    {
      console.log(e)
    }
  }
  //审核动态通过
  async checkMomentService(momentId)
  {
    const sql=`update moment set status=1 where momentId=?`;
    const result=await connection.execute(sql,[momentId]);
    return result[0];
  }
}
module.exports=new CheckService()