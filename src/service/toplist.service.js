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
  async getToplistDetailService(categoryId)
  {
    const sql=
        `select vc.categoryId,vc.name,momentId,(select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)
        from user where user.userId=moment.userId) as user,
      (select vid from video where video.momentId=moment.momentId) as vid,
      (select playCount from video where video.momentId=moment.momentId) as playCount,
      updateTime,title,type,status,
      if(type=0,(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) from picture as p where p.momentId=moment.momentId),
      (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url)) from video LEFT JOIN vioimg on video.vid=vioimg.vid 
      where video.momentId=moment.momentId )
      )
      as picUrl,
      (select count(view.momentId) from view where view.momentId=moment.momentId) as views,
      (select count(s.momentId) from subscribe as s where s.momentId=moment.momentId) as subs,
      (select count(c.momentId) from comment as c where c.momentId=moment.momentId and c.replyId is null) as comment,
      (select count(t.momentId) from thumbs as t where t.momentId=moment.momentId) as thumbs
      from video_cate as vc 
      LEFT JOIN moment on moment.categoryId=vc.categoryId
      where vc.categoryId=? and momentId is not null
      ORDER BY playCount desc,thumbs desc`
    const result=await connection.execute(sql,[categoryId]);
    return result[0];  
  }
}
module.exports=new ToplistService()