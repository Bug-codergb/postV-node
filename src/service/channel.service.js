const connection =require("../app/database");
const {
  APP_HOST,
  APP_PORT
}=require("../app/config")
class ChannelService{
  async createService(name){
    try{
      const id=new Date().getTime();
    const sql=`insert into channel_cate(id,name) values(?,?)`;
    const result=await connection.execute(sql,[id,name]);
    return result[0];
    }catch(e){
      console.log(e)
    }
  }
  //获取所有分类
  async getAllCateService(){
    try{
      const sql=`select * from channel_cate`;
    const result=await connection.execute(sql);
    return result[0];
    }catch(e){
      console.log(e);
    }
  }
  //添加专栏内容
  async addChannelService(title,content,userId,cateId){
    const id=new Date().getTime();
    const picUrl=`${APP_HOST}:${APP_PORT}/cover/id=?${id}`;
    const sql=`insert into channel(cId,title,content,userId,cateId,picUrl) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,title,content,userId,cateId,picUrl]);
    return result;  
  }
  //上传封面
  async uploadCoverService(cId,mimetype,destination,filename,size,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_cover(id,cId,fileName,size,mimetype,originalname,dest) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cId,filename,size,mimetype,originalname,destination]);
    return result[0];
  }
}
module.exports=new ChannelService();