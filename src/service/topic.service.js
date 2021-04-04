const connection=require('../app/database');
const {
  APP_PORT,
  APP_HOST
}=require('../app/config')
class TopicService{
  async createService(name)
  {
    const id=new Date().getTime();
    const sql=`insert into topic (topicId,name) values(?,?)`;
    const result=await connection.execute(sql,[id,name]);
    return result[0]
  }
  async getAllTopicService(offset,limit)
  {
    const sql=`select topic.topicId,name,topic.updateTime,views,follow,description,leader,picUrl,
    (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=leader) as user,
              (select count(userId) from topic_user as tu where tu.topicId=topic.topicId) as users
              from topic left join topic_img as tc on tc.topicId=topic.topicId 
              limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0];
  }
  //为话题配封面
  async setTopicImgService(userId,topicId,mimetype,filename,size)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/topic/cover?id=${id}`;
    const sql=`insert into topic_img(id,topicId,userId,mimetype,fileName,picUrl,size) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,topicId,userId,mimetype,filename,url,size]);
    return result[0];
  }
  //获取话题封面
  async getTopicCoverService(id)  
  {
    const sql=`select * from topic_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  async delTopicService(topicId)
  {
    const sql=`delete from topic where topicId=?`;
    const result = await connection.execute(sql,[topicId]);
    return result;
  }
  async addContentService(topicId,title,content)
  {
    const id=new Date().getTime();
    const sql=`insert into topic_content (id,topicId,content,title) values(?,?,?,?)`;
    const result =await connection.execute(sql,[id,topicId,content,title]);
    return {
      status:200,
      topic_content_id:id
    }
  }
  async addContentImgService(topic_content_id,userId,mimetype,filename,originalname,size)
  {
    const id=new Date().getTime();
    const picUrl=`${APP_HOST}:${APP_PORT}/topic/content/img?id=${id}`;
    const sql=`insert into topic_content_img (id,topic_content_id,userId,mimetype,fileName,picUrl,size,originalname) values(?,?,?,?,?,?,?,?)`;
    const result= await connection.execute(sql,[id,topic_content_id,userId,mimetype,filename,picUrl,size,originalname]);
    return result[0]
  }
  //获取动态图片
  async getTopicImgService(id)
  {
    const sql=`select * from topic_content_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //获取话题内容
  async getTopicContentService(topicId,offset,limit)
  {
    const sql=`
    select topic.topicId,name,topic.updateTime,views,follow,description,
       (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=leader) as user,
			 picUrl,
       (select count(userId) from topic_user as tu where tu.topicId=topic.topicId) as users,
			 (select JSON_ARRAYAGG(JSON_OBJECT('topic_content_id',tc.id,'title',title,'content',content,'picUrl',
			         (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
							  from topic_content_img as tci where tci.topic_content_id=tc.id ),
								'originalNames',(select JSON_ARRAYAGG(JSON_OBJECT('originalName',originalName)) 
							  from topic_content_img as tci where tci.topic_content_id=tc.id ),
                'user',(select JSON_OBJECT('userId',tc.userId,'userName',userName,'avatarUrl',avatarUrl) 
								        FROM user where user.userId=tc.userId))) 
			  from topic_content as tc
        where tc.topicId=topic.topicId
        GROUP BY topicId
        limit ?,?) as content
    from topic left join topic_img as tc on tc.topicId=topic.topicId 
    where topic.topicId=?`;
    const result=await connection.execute(sql,[offset,limit,topicId]);
    return result[0];
  }
  //删除专题下内容
  async delTopicContentService(id)
  {
    const sql=`delete from topic_content where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //评论专题下内容
  async setTopicCommentService(topic_content_id,content,userId)
  {
    const id=new Date().getTime();
    const sql=`insert into comment(commentId,content,topic_content_id,userId) values(?,?,?,?)`;
    const result=await connection.execute(sql,[id,content,topic_content_id,userId]);
    return result[0];
  }
  //根据评论ID获取 topic_content_id;
  async getContentIdByComentId(commentId)
  {
    const sql=`select topic_content_id from comment where commentId=?`;
    const result=await connection.execute(sql,[commentId]);
    return result[0];
  }
  //回复评论
  async replyComentService(replyId,content,userId,topic_content_id)
  {
    const id=new Date().getTime();
    const sql=`insert into comment(commentId,content,userId,replyId,topic_content_id) values(?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,content,userId,replyId,topic_content_id]);
    return result[0];
  }
  //收藏专题内容
  async subTopicContentService(userId,topic_content_id)
  {
    const id=new Date().getTime();
    const sql=`insert into subscribe (id,userId,topic_content_id) values(?,?,?)`;
    const result=await connection.execute(sql,[id,userId,topic_content_id]);
    return result[0]
  }
  //是否已经收藏
  async isSubService(userId,topic_content_id)
  {
    const sql=`select * from subscribe where userId=? and topic_content_id=?`;
    const result=await connection.execute(sql,[userId,topic_content_id]);
    return result[0]
  }
  //获取专题内容详情
  async getTopicContentDetailService(topic_content_id)
  {
    const sql=`
    select tc.id as topic_content_id,topicId,content,updateTime,title,
       (select (JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)) from user where user.userId=tc.userId) as user,
			 (select (JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl))) from topic_content_img as tci where tci.topic_content_id=tc.id) as picUrl,
			 (select count(subscribe.topic_content_id) from subscribe 
			                                           where subscribe.topic_content_id=tc.id 
																								) as sub,
			 (select count(comment.topic_content_id) from comment 
																							where comment.topic_content_id=tc.id and comment.replyId is null
																							) as comments
    from topic_content as tc
    where tc.id=?`;
    const res=await connection.execute(sql,[topic_content_id]);
    const result=await new TopicService().getTopicContentCom(topic_content_id);
    return Object.assign(res[0][0],result[0]);
  }
  //获取专题内容评论
  async getTopicContentCom(topic_content_id)
  {
    const sql=`select tc.id as topic_content_id,topicId,tc.content,
    JSON_ARRAYAGG(JSON_OBJECT('commentId',commentId,'content',comment.content,'updateTime',comment.updateTime,
    'user',(select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=comment.userId),
    'reply', (select JSON_ARRAYAGG(JSON_OBJECT('replyId',c.commentId,'content',c.content,
     'user',(select JSON_OBJECT('userId',c.userId,'userName',userName,'avatarUrl',avatarUrl) FROM user where user.userId=c.userId ) )) 
     from comment as c where c.replyId=comment.commentId)   )) as comment
    from topic_content as tc
    LEFT JOIN comment on tc.id=comment.topic_content_id
    where comment.replyId is null
    GROUP BY tc.id
    HAVING tc.id=?`;
    const result=await connection.execute(sql,[topic_content_id]);
    return result[0];
  }
}
module.exports=new TopicService();