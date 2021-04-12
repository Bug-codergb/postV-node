const connection =require('../app/database')
class ToplistService{
  async getToplistPicService(offset,limit)
  {
    try{
    const sql=
    `select id,p.momentId,m.title,picUrl,m.updateTime,
    (select JSON_OBJECT('userId',u.userId,'userName',u.userName,'avatarUrl',u.avatarUrl)
    from user as u where u.userId=p.userId ) as user,
    (select count(s.momentId) 
    from picture LEFT JOIN moment as mo on mo.momentId=picture.momentId LEFT JOIN subscribe as s on s.momentId=mo.momentId
    where s.momentId=m.momentId) as sub,
    (select count(com.momentId) 
    from picture LEFT JOIN moment as mo on mo.momentId=picture.momentId LEFT JOIN comment as com on com.momentId=mo.momentId
    where com.momentId=m.momentId and replyId is null) as comments,
    (select count(t.momentId) 
    from picture LEFT JOIN moment as mo on mo.momentId=picture.momentId LEFT JOIN thumbs as t on t.momentId=mo.momentId
    where t.momentId=m.momentId) as thumbs
    from picture as p
    LEFT JOIN moment as m on m.momentId=p.momentId
    left join category as c on c.categoryId=m.categoryId
    where c.name="图片" 
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
    }catch(e)
    {
      console.log(e);
    }
  }
  //获取视频榜单
  async getToplistVioService(offset,limit)
  {
    const sql=`select vid,video.updateTime,m.momentId,m.title,video.playCount,video.duration,
      (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=video.userId) as user,
      (select url from vioimg where vioimg.vid=video.vid) as coverUrl,
      (select count(s.momentId) 
        from video LEFT JOIN moment as mo on mo.momentId=video.momentId LEFT JOIN subscribe as s on s.momentId=mo.momentId
        where s.momentId=m.momentId) as sub,
        (select count(com.momentId) 
        from video LEFT JOIN moment as mo on mo.momentId=video.momentId LEFT JOIN comment as com on com.momentId=mo.momentId
        where com.momentId=m.momentId and replyId is null) as comments,
        (select count(t.momentId) 
        from video LEFT JOIN moment as mo on mo.momentId=video.momentId LEFT JOIN thumbs as t on t.momentId=mo.momentId
        where t.momentId=m.momentId) as thumbs,
        (select name from video_cate where video.categoryId=video_cate.categoryId) as cate
    from video 
    LEFT JOIN moment as m on m.momentId=video.momentId
    LEFT JOIN category as c on c.categoryId=m.categoryId		
    where c.name="视频" and status=1
    GROUP BY video.playCount
    ORDER BY video.playCount desc
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
  }
  //获取文章榜单
  async getToplistArticleService(offset,limit)
  {
    const sql=` select c.categoryId,c.name,
    moment.momentId,moment.content,moment.title,moment.updateTime,
     (select count(view.momentId) from view where view.momentId=moment.momentId) as views,
     (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=moment.userId) as user,type,
     if(type=0,(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
                         from picture where picture.momentId=moment.momentId),
                         (select if(vioimg.url is null,null,JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url))  )
                         from video LEFT JOIN vioimg on vioimg.vid=video.vid where video.momentId=moment.momentId)) as picUrl,
     (select count(s.momentId) from subscribe as s where s.momentId=moment.momentId) as subs,
     (select count(c.momentId) from comment as c where c.momentId=moment.momentId and c.replyId is null) as comments,
     (select count(t.momentId) from thumbs as t where t.momentId=moment.momentId) as thumbs
     from category as c
     LEFT JOIN moment on moment.categoryId=c.categoryId
     where c.categoryId=1616757439494 and moment.status=1
     GROUP BY momentId
     HAVING picUrl is not null
     ORDER BY thumbs desc
     limit ?,?`;
     const result=await connection.execute(sql,[offset,limit]);
     return result[0]
  }
}
module.exports=new ToplistService()