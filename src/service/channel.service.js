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
  //添加分类内容
  async addCateConService(cateId,name){
    const id=new Date().getTime();
    const url=`${APP_HOST}/${APP_PORT}/channel/cate/con/cover?id=${id}`;
    const sql=`insert into channel_cate_con(id,name,cateId,coverUrl) values(?,?,?,?)`;
    const result=await connection.execute(sql,[id,name,cateId,url]);
    return result[0];
  }

  //添加专栏内容
  async addChannelService(title,content,userId,cateId){
    const id=new Date().getTime();
    const picUrl=`${APP_HOST}:${APP_PORT}/channel/cover?id=${id}`;
    const vidUrl=`${APP_HOST}:${APP_PORT}/channel/video?id=${id}`;
    const sql=`insert into channel(cId,title,content,userId,cateId,picUrl,vidUrl) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,title,content,userId,cateId,picUrl,vidUrl]);
    return id;  
  }
  //上传封面
  async uploadCoverService(cId,mimetype,destination,filename,size,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_cover(id,cId,fileName,size,mimetype,originalname,dest) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cId,filename,size,mimetype,originalname,destination]);
    return result[0];
  } 
  //获取封面文件信息
  async getChannelCoverService(cId){
    const sql=`select * from channel_cover where cId=?`;
    const result=await connection.execute(sql,[cId]);
    return result[0];
  } 
  //上传channel视频
  async uploadVideoService(cId,mimetype,dt,filename,destination,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_video(vid,cId,mimetype,duration,fileName,dest,originalName) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cId,mimetype,dt,filename,destination,originalname]);
    return result[0];
  }
  //获取视频
  async getChannelVideoService(id){
    const sql=`select * from channel_video where cId=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //添加分类内容图片
  async addChannelCateCoverService(cate_con_id,filename,mimetype,destination,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_cate_con_img(id,cate_con_id,fileName,mimetype,dest,originalName) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cate_con_id,filename,mimetype,destination,originalname]);
    return result[0];
  }
  //获取分类内容图片
  async getChannelCateCoverService(id){
    const sql=`select * from channel_cate_con_img where cate_con_id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
}
module.exports=new ChannelService();