const connection=require('../app/database')
class CategoryService{
  async createService(name)
  {
    const id=new Date().getTime();
    const sql=`insert into category (categoryId,name) values(?,?)`;
    const result=await connection.execute(sql,[id,name]);
    return result[0]
  }
  async getAllCateService(offset,limit)
  {
    const sql=`select categoryId,name from category where name not in ('微课堂','放映厅') limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
  }
  //获取分类名称根据分类ID
  async getCateNameByIdService(categoryId)
  {
    const sql=`select name from category where categoryId=?`;
    const result=await connection.execute(sql,[categoryId]);
    return result[0];
  }
  async addCheckMomentService(userId, title, content,cate)
  {
    const id=new Date().getTime();
    const sql=`insert into check_moment (momentId,userId,title,content,categoryId) values(?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,userId,title,content,cate]);
    return id;
  }
  //获取分类下内容
  async getCateDetailService(categoryId,offset,limit)
  {
    try{
      const sql=`
      select c.categoryId,c.name,momentId,(select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)
                                       from user where user.userId=moment.userId) as user,
         updateTime,title,type,status,
         if(type=0,(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) from picture as p where p.momentId=moment.momentId),
                    (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url)) from video LEFT JOIN vioimg on video.vid=vioimg.vid 
                     where video.momentId=moment.momentId )
           )
          as picUrl,
         (select count(view.momentId) from view where view.momentId=moment.momentId) as views,
         (select count(s.momentId) from subscribe as s where s.momentId=moment.momentId) as subs,
         (select count(c.momentId) from comment as c where c.momentId=moment.momentId and c.replyId is null) as comments,
         (select count(t.momentId) from thumbs as t where t.momentId=moment.momentId) as thumbs
      from category as c 
      LEFT JOIN moment on moment.categoryId=c.categoryId
      where c.categoryId=? and moment.status=1
      limit ?,?`;
      // const result=await connection.execute(sql,[categoryId,offset,limit]);
      const result=await connection.execute(sql,[categoryId,offset,limit]);
      return result[0]
    }catch(e)  
    {
      console.log(e)
    }
  }
  //获取分类内容子分类
  async addCateConService(name,cateId){
    const id=new Date().getTime();
    const sql=`insert into moment_cate(id,name,cateId) values(?,?,?)`;
    const result=await connection.execute(sql,[id,name,cateId]);
    return result[0];
  }
}
module.exports=new CategoryService()