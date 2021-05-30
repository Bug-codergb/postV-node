const connection =require('../app/database');
const {
    APP_PORT,
    APP_HOST
}=require('../app/config')
class FileService{
    async createService(userId,mimetype,fileName,size)
    {
        const id=new Date().getTime();
        try{
            const sql=`insert into avatar (id,userId,mimetype,fileName,size) values(?,?,?,?,?)`
            const result=await connection.execute(sql,[id,userId,mimetype,fileName,size]);
            return result[0]
        }catch (e) {
            console.log(e)
        }
    }
    async addUserAvatarService(userId,url)
    {
      const sql=`update user set avatarUrl=? where userId=?`;
      const result=await connection.execute(sql,[url,userId])
    }
    async getAvatarService(userId)
    {
        const sql=`select * from avatar where userId=?`;
        const result=await connection.execute(sql,[userId]);
        return result[0]
    }
    //为动态配图
    async addMomentPicService(momentId,userId,mimetype,fileName,size,originalname)
    {
        const id=new Date().getTime();
        const picUrl=`${APP_HOST}:${APP_PORT}/moment/picture?id=${id}&type=small`;
        const sql=`insert into picture(id,momentId,userId,mimetype,fileName,originalname,size,picUrl) values(?,?,?,?,?,?,?,?)`;
        const result=await connection.execute(sql,[id,momentId,userId,mimetype,fileName,originalname,size,picUrl]);
        return picUrl;
    }
    async getMomentPicService(id)
    {
        const sql=`select * from picture where id=?`;
        const result =await connection.execute(sql,[id]);
        return result[0]
    }   
    async deleteMomentPicService(id)
    {
        const sql=`delete from picture where id=?`;
        const result=await connection.execute(sql,[id]);
        return result[0]
    }
}
module.exports=new FileService()