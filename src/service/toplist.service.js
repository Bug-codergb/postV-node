const connection =require('../app/database')
class ToplistService{
  async getToplistPicService(offset,limit)
  {
    try{
      const sql=
    `select id,p.momentId,m.title,picUrl,count(p.momentId) as picCount,
            (select JSON_OBJECT('userId',u.userId,'userName',u.userName,'avatarUrl',u.avatarUrl)
             from user as u where u.userId=p.userId ) as user
    from picture as p
    LEFT JOIN moment as m on m.momentId=p.momentId
    GROUP BY p.momentId
    having picCount=1
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
    }catch(e)
    {
      console.log(e);
    }
  }
}
module.exports=new ToplistService()