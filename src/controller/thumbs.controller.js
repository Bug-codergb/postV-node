const {
    getMomentByIdService
}=require('../service/moment.service');
const {
    getMomentBycomId
}=require('../service/comment.service')
const {
    addThumbsMomentService,
    addThumbsCommentService,
    deleteThumbService
}=require('../service/thumbs.service')
const errorType=require('../constants/errorType.js');
class ThumbsController{
    async addThumbs(ctx,next)     
    {
        const {id}=ctx.query;
        const result=await getMomentByIdService(id);  
        const {userId}=ctx.user;
        if(result[0].momentId)
        {
            console.log("我是评论")
           const result=await addThumbsMomentService(userId,id);
           ctx.body=result[0];
        }
        else {
            const result=await getMomentBycomId(id)
            if(result[0])
            {
                try{
                    const result=await addThumbsCommentService(userId,id);
                    ctx.body=result[0]
                }catch(e)
                {
                    console.log(e)
                }
            }
            else{
                const err=new Error(errorType.RESOURCE_DOES_NOT_EXIST);
                return ctx.app.emit('error',err,ctx);
            }
        }
    }
    async delThumbs(ctx,next)  
    {
        const {userId}=ctx.user;
        //console.log(ctx.source);
        //console.log(Object.keys(ctx.source)[0])
        const result=await deleteThumbService(userId,Object.keys(ctx.source)[0],ctx.source)
        ctx.body=result;
    }
}
module.exports=new ThumbsController();  