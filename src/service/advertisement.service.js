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
}
module.exports=new AdvertisementService();