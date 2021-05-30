const fs=require('fs');
const {
    getSizePic
}=require("../utils/getSizePic")
const {
    createService,
    addUserAvatarService,
    getAvatarService,
    addMomentPicService,
    getMomentPicService,
    deleteMomentPicService
}=require('../service/file.service')
const {
    APP_PORT,
    APP_HOST
}=require('../app/config')
const errorType=require('../constants/errorType.js')
class FileController{
    async create(ctx,next){
        try{
            const {mimetype,size,filename}=ctx.req.file;
            const {userId}=ctx.user;
            const result=await createService(userId,mimetype,filename,size);
            const avatarUrl=`${APP_HOST}:${APP_PORT}/user/avatar?userId=${userId}`;
            await addUserAvatarService(userId,avatarUrl);
            ctx.body=result;
        }catch (e) {
            console.log(e)
        }  
    }
    async getAvatar(ctx,next)
    {
        const {userId}=ctx.query;
        const result=await getAvatarService(userId);
        const {mimetype,fileName}=result[0];
        ctx.response.set('content-type',mimetype);
        ctx.response.body=fs.createReadStream(`./upload/avatar/${fileName}`)
    }
    async addMomentPic(ctx,next)
    {
        const {userId}=ctx.user;
        let result='';
        const momentId=new Date().getTime();
        const {file}=ctx.req
        const {mimetype,filename,size,originalname}=file;
        result=await addMomentPicService(momentId,userId,mimetype,filename,size,originalname.replace(/\s+/g,''));
        ctx.body={
            errno:0,
            data:[result],
            momentId
        }  
    }
    async getMomentPic(ctx,next)
    {
        const {id,type}=ctx.query;
        const result =await getMomentPicService(id);
        if(result.length===0)
        {
            const err=new Error(errorType.RESOURCE_DOES_NOT_EXIST);
            return ctx.app.emit('error',err,ctx)
        }
        let {fileName,mimetype}=result[0];
        const newFileName=await getSizePic(type,fileName,`./upload/picture`);
        ctx.set('content-type',mimetype)
        ctx.body=fs.createReadStream(`./upload/picture/${newFileName}`);
    }
    async deleteMomentPic(ctx,next)
    {  
        const {id}=ctx.query;
        const result=await deleteMomentPicService(id);
        ctx.body=result;   
    }
}
module.exports=new FileController()