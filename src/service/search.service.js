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
  //话题搜索
  async topicSearch(keyword){
    const desc='`desc`';
    const sql=`select topic.topicId,name,topic.updateTime,views,follow,description,
    (select ti.picUrl from topic_img as ti where ti.topicId=topic.topicId) as picUrl,
    (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) 
    from user where user.userId=leader) as leader,
    JSON_ARRAYAGG(JSON_OBJECT('title',title,'topic_content_id',tc.id,'user',
    (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl,'desc',${desc}) from user where user.userId=tc.userId ),
    'picUrl',(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) from topic_content_img as tci where tci.topic_content_id=tc.id)
    )) AS content,
    (select count(tu.topicId) from topic_user as tu where tu.topicId=topic.topicId) as users
    from topic
    LEFT JOIN topic_content as tc on tc.topicId =topic.topicId
    GROUP BY topic.topicId
    having name like '%${keyword}%'`;
    const result=await connection.execute(sql);
    return result[0]
  }
  //频道搜索
  async channelService(keyword){
    const sql=`
    select c.cId as id,c.title,c.picUrl,c.createTime,c.updateTime,cv.playCount,cv.duration,
       (select JSON_OBJECT('userId',c.userId,'userName',userName,'avatarUrl',avatarUrl) 
			   from user as u where u.userId=c.userId) as user,
				JSON_OBJECT('id',c.cateId,'name',ccc.name) as category	
    from channel as c
    LEFT JOIN channel_cate_con as ccc on ccc.id=c.cateId
    LEFT JOIN channel_video as cv on cv.cId=c.cId
    where c.title like '%${keyword}%'`;
    const result=await connection.execute(sql);
    return result[0]
  }
  async searchService(keyword) {   
    try {
     const [momentResult,userResult,topicResult,channelResult]=await Promise.all([new SearchService().momentSearch(keyword),
                                                        new SearchService().userSearch(keyword),
                                                        new SearchService().topicSearch(keyword),
                                                        new SearchService().channelService(keyword)]);
    return {
      user:userResult,
      moment:momentResult,
      topic:topicResult,
      channel:channelResult
    }
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = new SearchService()