const fs=require('fs')
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
        const {momentId}=ctx.query;
        const picUrl=`${APP_HOST}:${APP_PORT}/moment/picture?`;
        //console.log(ctx.req.files)
        let result=''
        for(let file of ctx.req.files)
        {
            const {mimetype,filename,size,originalname}=file;
            result=await addMomentPicService(momentId,userId,mimetype,filename,size,picUrl,originalname.replace(/\s+/g,''));
        }
        ctx.body={
            status:200
        }  
    }
    async getMomentPic(ctx,next)
    {
        const {id}=ctx.query;
        const result =await getMomentPicService(id);
        if(result.length===0)
        {
            const err=new Error(errorType.RESOURCE_DOES_NOT_EXIST);
            return ctx.app.emit('error',err,ctx)
        }
        const {fileName,mimetype}=result[0];
        //console.log(mimetype)
       ctx.set('content-type',mimetype)
        //ctx.type="flv-application/octet-stream"
        ctx.body=fs.createReadStream(`./upload/picture/${fileName}`);
    }
    async deleteMomentPic(ctx,next)
    {  
        const {id}=ctx.query;
        const result=await deleteMomentPicService(id);
        ctx.body=result;   
    }
}
module.exports=new FileController()