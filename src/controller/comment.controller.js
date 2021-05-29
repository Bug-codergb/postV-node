const fs=require("fs");
const {
    createService,
    replyService,
    getAllCommentService,
    getCommentByIdService,
    delCommentService,
    getMomentComService,
    uploadComImgService,
    getCommentImgService
}=require('../service/comment.service')
const {
    paramError
}=require('../utils/paramError')
class CommentController{
    async create(ctx,next)
    {
        const {userId}=ctx.user;
        const {momentId}=ctx.query;
        const {content}=ctx.request.body;
        const result=await createService(momentId,content,userId);
        ctx.body=result;
    }
    async reply(ctx,next)  
    {
        const {userId}=ctx.user;
        const {content}=ctx.request.body;
        const {commentId}=ctx.query;
        if(!commentId||!content)
        {
            paramError(ctx);    
            return ;
        }
        const result=await replyService(commentId,content,userId);
        ctx.body=result;
    }
    async getAllComment(ctx,next)
    {
        const{offset,limit}=ctx.query;
        const result=await getAllCommentService(offset,limit);
        ctx.body=result;
    }
    async getCommentById(ctx,next)
    {
        const {commentId}=ctx.query;
        if(!commentId)
        {
            paramError(ctx)
            return;
        }
        const result=await getCommentByIdService(commentId);
        ctx.body=result[0];
    }
    async delComment(ctx,next)
    {
        const {commentId}=ctx.query;
        const result=await delCommentService(commentId);
        ctx.body=result;
    }
    //获取动态评论
    async getMomentCom(ctx,next)
    {
        const {momentId}=ctx.query;
        const result=await getMomentComService(momentId);
        ctx.body=result[0];
    }
    //上传评论图片
    async uploadComImg(ctx,next){
        const {filename,size,mimetype,originalname,destination}=ctx.req.file;
        const result=await uploadComImgService(filename,size,mimetype,originalname,destination);
        const {comId,url}=result;
        ctx.body={
            errno:0,
            data:[url],
            comId
        }
    }
    //获取评论图片
    async getCommentImg(ctx,next){
        const {id}=ctx.query;
        const result=await getCommentImgService(id);
        const {filename,mimetype,dest}=result[0];
        ctx.set("content-type",mimetype);
        ctx.body=fs.createReadStream(`${dest}/${filename}`);
    }
}
module.exports=new CommentController();