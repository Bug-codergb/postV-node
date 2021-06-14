const connection =require('../app/database');
class CheckService{
  async getAllCheckService(offset,limit)
  {
    try{
      const sql=
      `select momentId,title,content,m.updateTime,status,type,
       JSON_OBJECT('userId',user.userId,'userName',user.userName) as user,
       JSON_OBJECT('categoryId',c.categoryId,'name',c.name) as category,
       (select vid from video as v where v.momentId=m.momentId) as vid 
       from moment as m
       LEFT JOIN user on m.userId=user.userId
       LEFT JOIN category as c on c.categoryId=m.categoryId
       ORDER BY m.updateTime desc
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
  async getAllCheckVioService(cateId,offset,limit){
    try{
      const sql=`
    select vid,m.title,m.content,(select JSON_OBJECT('userId',v.userId,'userName',userName,'avatarUrl',avatarUrl) 
                              FROM user where user.userId=v.userId) as user,
       v.createTime,v.updateTime,v.momentId,playCount,duration,
			 (select JSON_OBJECT('id',m.categoryId,'name',c.name) 
			  FROM category as c where c.categoryId=m.categoryId) as cate,
			 JSON_OBJECT('categoryId',mc.id,'name',mc.name) AS category,
			 (select url from vioimg as vi where vi.vid=v.vid) as picUrl
    from video as v
    LEFT JOIN moment as m on m.momentId=v.momentId
    LEFT JOIN moment_cate as mc on mc.id=v.categoryId
    where mc.id=?
    ORDER BY v.createTime desc
    limit ?,?`;
      const result=await connection.execute(sql,[cateId,offset,limit]);
      return result[0];
    }catch (e){
      console.log(e);
    }
  }
}
module.exports=new CheckService()