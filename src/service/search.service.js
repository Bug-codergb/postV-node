const connection=require('../app/database');

class SearchService {
  //动态搜索结果
  async momentSearch(keyword)
  {
    const sql = `
    select m.momentId,m.content,m.title,m.updateTime,
   JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) as pictures,
   (select JSON_OBJECT('user',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=m.userId) as user,
   (select count(thumbs.momentId) from thumbs where thumbs.momentId=m.momentId ) as thumbs,
   (select count(comment.momentId) from comment where comment.momentId=m.momentId and replyId is null) as comments
    from moment as m
    LEFT JOIN picture on m.momentId=picture.momentId
    where m.content like '%${keyword}%' or m.title like '%${keyword}%'
    GROUP BY m.momentId
    limit 0,5`;
    const result=await connection.execute(sql);
    return result[0];
  }
  async userSearch(keyword)
  {
    const desc='`desc`';
    const sql=`
    select userId,userName,createTime,avatarUrl,${desc}
    from user as u
    where u.userName like '%${keyword}%' 
    limit 0,5
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