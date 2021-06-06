const connection =require('../app/database')
class ToplistService{
  async getSpcolumnTopService(cateId){
      const sql=`
      select m.momentId,title,m.createTime,m.updateTime,type,
       (select JSON_OBJECT('userId',m.userId,'userName',userName,'avatarUrl',avatarUrl)
         from user where user.userId=m.userId) as user,
       JSON_OBJECT('id',s.id,'name',s.name) as category,
			 (select JSON_ARRAYAGG(picUrl) from picture as p where p.momentId=m.momentId) as picUrl,
			 (select count(t.userId) from thumbs as t where t.momentId=m.momentId) as thumbs,
			 (select count(v.userId) from view as v where v.momentId=m.momentId) as view,
			 (select count(c.commentId) from comment as c where c.momentId=m.momentId and replyId is null) as comments 
        from moment as m 
        LEFT JOIN spcolumn_moment as sm on sm.momentId=m.momentId				
        LEFT JOIN spcolumn as s on sm.spId=s.id				
        where status=1 and m.categoryId=?
        ORDER BY thumbs desc, createTime desc
        limit 0,100`;
      const result=await connection.execute(sql,[cateId]);
      return result[0];
  }
  //获取其它榜单
  async getToplistService(cateId){
      const sql=`
      select m.momentId,v.vid,title,m.createTime,m.updateTime,type,v.playCount,v.duration,
       (select JSON_OBJECT('userId',m.userId,'userName',userName,'avatarUrl',avatarUrl)
         from user where user.userId=m.userId) as user,
       JSON_OBJECT('id',mc.id,'name',mc.name) as category,
			 (select JSON_ARRAYAGG(url) from vioimg as vi where vi.vId=v.vid) as picUrl,
			 (select count(t.userId) from thumbs as t where t.momentId=m.momentId) as thumbs,
			 (select count(v.userId) from view as v where v.momentId=m.momentId) as view,
			 (select count(c.commentId) from comment as c where c.momentId=m.momentId and replyId is null) as comments 
      from video as v 
      LEFT JOIN moment as m on m.momentId=v.momentId				
      LEFT JOIN moment_cate as mc on mc.id=v.categoryId				
      where status=1 and m.categoryId=?
      ORDER BY thumbs desc, createTime desc
      limit 0,100;`;
      const result=await connection.execute(sql,[cateId]);
      return result[0];
  }
}
module.exports=new ToplistService()