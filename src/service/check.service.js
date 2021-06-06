const connection =require('../app/database');
class CheckService{
  async getAllCheckService(offset,limit)
  {
    try{
      const sql=
      `select momentId,title,content,moment.updateTime,status,type,
       JSON_OBJECT('userId',user.userId,'userName',user.userName) as user,
       JSON_OBJECT('categoryId',c.categoryId,'name',c.name) as category 
       from moment
       LEFT JOIN user on moment.userId=user.userId
       LEFT JOIN category as c on c.categoryId=moment.categoryId
       ORDER BY moment.updateTime desc
       limit ?,?;
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
  //获取所有check video
  async getAllCheckVioService(offset,limit){
    const sql=`
    select vid,m.title,m.content,(select JSON_OBJECT('userId',v.userId,'name',userName,'avatarUrl',avatarUrl) 
                              FROM user where user.userId=v.userId) as user,
       v.createTime,v.updateTime,v.momentId,playCount,duration,m.categoryId,
			 JSON_OBJECT('categoryId',mc.id,'name',mc.name) AS category,
			 (select url from vioimg as vi where vi.vid=v.vid) as picUrl
    from video as v
    LEFT JOIN moment as m on m.momentId=v.momentId
    LEFT JOIN moment_cate as mc on mc.id=v.categoryId
    ORDER BY v.createTime desc
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0];
  }
}
module.exports=new CheckService()