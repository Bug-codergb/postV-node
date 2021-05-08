const connection =require('../app/database');
class CheckService{
  async getAllCheckService(offset,limit)
  {
    try{
      const sql=
      `select momentId,title,content,moment.updateTime,status,
      JSON_OBJECT('userId',user.userId,'userName',user.userName) as user
      from moment
      LEFT JOIN user on moment.userId=user.userId
      ORDER BY moment.updateTime desc
      limit ?,?
      `;
    const count=await new CheckService().getCheckMomenetCount();
    const result=await connection.execute(sql,[offset,limit]);
    const res={
      count:count[0].count,
      moments:result[0]
    }
    return res;
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
  //获取所有check动态数量
  async getCheckMomenetCount()
  {
    const sql=`
    select count(momentId) as count
    from moment
    LEFT JOIN user on moment.userId=user.userId`;
    const result=await connection.execute(sql);
    return result[0];
  }
}
module.exports=new CheckService()