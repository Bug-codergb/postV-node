const connection=require("../app/database");
class SpcolumnService{
  async createService(name){
      const id=new Date().getTime();
      const sql=`insert into spcolumn(id,name) values(?,?)`;
      const result=await connection.execute(sql,[id,name]);
      return result[0];
  }
  //获取专栏分类
  async getSpcolumnCateService(){
      const sql=`select * from spcolumn`;
      const result=await connection.execute(sql);
      return result[0];
  }
  //为动态划分专栏
  async setMomentSpcolumnService(spId,momentId){
      const sql=`insert into spcolumn_moment(spId,momentId) values(?,?)`;
      const result=await connection.execute(sql,[spId,momentId]);
      return result;
  }
  //获取专栏分类下内容
  async getSpcolumnDetailService(spId,cateId,offset,limit){
      const sql=`select c.categoryId,c.name,moment.momentId,
         (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)
                                       from user where user.userId=moment.userId) as user,
         updateTime,title,type,status,
         (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
          from picture as p where p.momentId=moment.momentId) as picUrl,
         (select count(view.momentId) from view where view.momentId=moment.momentId) as views,
         (select count(s.momentId) from subscribe as s where s.momentId=moment.momentId) as subs,
         (select count(c.momentId) from comment as c where c.momentId=moment.momentId and c.replyId is null) as comments,
         (select count(t.momentId) from thumbs as t where t.momentId=moment.momentId) as thumbs
      from category as c 
      LEFT JOIN moment on moment.categoryId=c.categoryId
        LEFT JOIN spcolumn_moment as sm on sm.momentId=moment.momentId
      where c.categoryId=? and spId=? and moment.status=1
      limit ?,?`;
      const result=await connection.execute(sql,[cateId,spId,offset,limit]);
      return result[0];
  }
}
module.exports=new SpcolumnService();