const connection=require('../app/database');
const {
  APP_PORT,
  APP_HOST
}=require('../app/config')
class KnowledgeService{
  async createService(title,userId,vip,description)
  {
    const id=new Date().getTime();
    const sql=`insert into knowledge(kid,title,userId,vip,description) values(?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,title,userId,vip,description]);
    return id;
  }
  //为课程配图
  async setKnowImgService(kid,mimetype,filename,size)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/knowledge/image?id=${id}`;
    const sql=`insert into knowledge_img (id,kid,picUrl,mimetype,fileName,size) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,kid,url,mimetype,filename,size]);
    return result[0];
  }  
  //根据kid获取课程图片信息
  async getImgByKonwService(id)
  {
    const sql=`select * from knowledge_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
  //上传课程内容
  async uploadKonwService(kid,title,fileName,size,mimetype)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/knowledge/content?id=${id}`;
    const sql=`insert into knowledge_content(id,kid,title,url,fileName,size,mimetype) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,kid,title,url,fileName,size,mimetype]);
    return result[0];
  }
  //获取课程内容信息
  async getKnowContentService(id)
  {
    const sql=`select * from knowledge_content where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
  //获取所有课程
  async getAllKnowService(offset,limit)
  {
    const sql=`
    select kid,title,description,JSON_OBJECT('userId',knowledge.userId,'userName',userName,'avatarUrl',avatarUrl) as user,playCount,knowledge.vip,knowledge.updateTime,
    (select picUrl from knowledge_img as ki where ki.kid=knowledge.kid ) as picUrl
    from knowledge
    LEFT JOIN user on user.userId=knowledge.userId
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
  }
  //获取课程下内容
  async getKnowDetailService(kid)  
  {
    const sql=`
    select knowledge.kid,knowledge.title,description,(select JSON_OBJECT('userId',knowledge.userId,'userName',userName,'avatarUrl',avatarUrl)
    from user where user.userId=knowledge.userId) as user,
    playCount,vip,updateTime,picUrl,
    (select JSON_ARRAYAGG(JSON_OBJECT('id',kc.id,'title',title,'duration',duration)) 
    from knowledge_content as kc where kc.kid=knowledge.kid) as content
    from knowledge
    LEFT JOIN knowledge_img as ki on ki.kid=knowledge.kid 
    where knowledge.kid=?`;
    const result=await connection.execute(sql,[kid]);
    return result[0]
  }
  //获取课程的url
  async getKnowUrlService(id)
  {
    const sql=`select id,kid,url from knowledge_content where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
}
module.exports=new KnowledgeService()