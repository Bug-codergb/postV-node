const connection=require('../app/database');
class ViewService{
  async createService(userId,momentId)
  {
    const sql=`insert into view(userId,momentId) values(?,?)`;
    const result =await connection.execute(sql,[userId,momentId]);
    return result[0]
  }
  async getmomentByUserIdService(userId,momentId)
  {
    const sql=`select * from view where userId=? and momentId=?`;
    const result=await connection.execute(sql,[userId,momentId]); 
    return result[0]
  }
}
module.exports=new ViewService()