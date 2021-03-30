const connection= require("../app/database");

class ThumbsService{
  async addThumbsMomentService(userId,momentId)
  {
      const sql=`insert into thumbs(userId,momentId) values(?,?)`;
      const result=await connection.execute(sql,[userId,momentId]);
      return result;
  }
  async addThumbsCommentService(userId,commentId)
  {
    try{
      const sql=`insert into thumbs(userId,commentId) values(?,?)`;
      const result=await connection.execute(sql,[userId,commentId]);
      return result;
    }catch(e)
    {
      console.log(e)
    }
  }
  //根据userId,判断commentId,momentId
  async getThumbByUserId(id)
  {
      const sql=`select * from thumbs where userId=?`;
      const result=await connection.execute(sql,[id]);
      return result[0]
  }
  async deleteThumbService(userId,source,id)
  {
      //console.log(id[source])
      const sql=`delete from thumbs where userId=? and ${source}=?`;
      const result=await connection.execute(sql,[userId,id[source]])
      return result[0]
  }
}
module.exports=new ThumbsService()