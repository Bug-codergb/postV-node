const connection=require('../app/database');
const {APP_PORT,APP_HOST}=require('../app/config')
class AdvertisementService{
  async createService(title,url)
  {
    const id=new Date().getTime();
    const sql=`insert into advertisement(id,url,title) values(?,?,?)`;
    const result=await connection.execute(sql,[id,url,title]);
    return result[0];
  }
  async uploadImgService(advertId,userId,mimetype,fileName)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/advert/img?id=${id}`;
    const sql=`insert into adver_img(id,advertId,userId,mimetype,fileName,picUrl) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,advertId,userId,mimetype,fileName,url]);
    return result[0]
  }
  //获取广告封面
  async getAdvertImgService(id)
  {
    const sql=`select * from adver_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
  //获取所有广告
  async getAllAdvertService(offset,limit)
  {
      try{
        const sql=`select advertisement.id as advertId,url,title,
      (select(JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)) 
      from user where user.userId=ai.userId) as user,
      picUrl,createTime
      from advertisement
      LEFT JOIN adver_img as ai on ai.advertId=advertisement.id
      limit ?,?
      `
      const result=await connection.execute(sql,[offset,limit]);
      return result[0]
      }catch(e)
      {
        console.log(e)
      }
  }
}
module.exports=new AdvertisementService();