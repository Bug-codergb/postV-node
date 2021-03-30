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
    const sql=`select * from topic limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
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
    const sql=`insert into topic_img (id,topic_content_id,userId,mimetype,fileName,picUrl,size,originalname) values(?,?,?,?,?,?,?,?)`;
    const result= await connection.execute(sql,[id,topic_content_id,userId,mimetype,filename,picUrl,size,originalname]);
    return result[0]
  }
  //获取动态图片
  async getTopicImgService(id)
  {
    const sql=`select * from topic_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //获取话题内容
  async getTopicContentService(topicId,offset,limit)
  {
    const sql=`
    select topic_content.id as topic_content_id,topicId,title,content,topic_content.updateTime,JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) as picUrls,
        JSON_ARRAYAGG(JSON_OBJECT('originalName',originalName)) as originalNames
    from topic_content
    LEFT JOIN topic_img on topic_content.id=topic_img.topic_content_id
    where topicId=?
    GROUP BY topic_content.id
    limit ?,?`;
    const result=await connection.execute(sql,[topicId,offset,limit]);
    return result[0];
  }
  //删除专题下内容
  async delTopicContentService(id)
  {
    const sql=`delete from topic_content where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
}
module.exports=new TopicService();