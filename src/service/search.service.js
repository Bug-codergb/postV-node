const connection=require('../app/database');
class SearchService {
  //动态搜索结果
  async momentSearch(keyword)
  {
      const sql = `
      select m.momentId,m.content,m.title,m.updateTime,m.status,type,
      if(type=0,JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)),(select JSON_ARRAYAGG(JSON_OBJECT('picuUrl',vioimg.url))
            from video LEFT JOIN vioimg on video.vid=vioimg.vid where video.momentId=m.momentId	)) as pictures,
            if(type=1,(select vid from video where video.momentId=m.momentId),null) as vid,
      (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=m.userId) as user,
      (select count(thumbs.momentId) from thumbs where thumbs.momentId=m.momentId ) as thumbs,
      (select count(comment.momentId) from comment where comment.momentId=m.momentId and replyId is null) as comments,
      (select count(view.momentId) from view where view.momentId=m.momentId) as views,
      (select count(sub.momentId) from subscribe as sub where sub.momentId=m.momentId) as sub,
      (select JSON_OBJECT('categoryId',moment.categoryId,'name',name) from moment LEFT JOIN category as c on moment.categoryId=c.categoryId 
      where momentId=m.momentId) as category
      from moment as m
      LEFT JOIN picture on m.momentId=picture.momentId
      where m.title like '%${keyword}%' and m.status=1 
      GROUP BY m.momentId
      having m.title is not null
      limit 0,30`;
    const result=await connection.execute(sql);
    return result[0];
  }  
  async userSearch(keyword)  
  {
    const desc='`desc`';
    const sql=`
    select user.userId,user.userName,vip,user.createTime,avatarUrl,${desc}, count(moment.momentId) as moments,
    (select count(fanId) from fans where user.userId=fans.userId) as fans,
     (select count(fans.userId) from fans where user.userId=fans.fanId) as follow,
       (select count(topicId) from topic_user where topic_user.userId=user.userId) AS topic
     from user LEFT JOIN moment on moment.userId=user.userId 
     GROUP BY user.userId
     HAVING user.userName like '%${keyword}%'
    `
    const result=await connection.execute(sql);
    return result[0]
  }
  async searchService(keyword) {   
    try {
     const [momentResult,userResult]=await Promise.all([new SearchService().momentSearch(keyword),
                                                        new SearchService().userSearch(keyword)]);
    return {
      user:userResult,
      moment:momentResult
    }
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = new SearchService()