const {
    createService,
    replyService,
    getAllCommentService,
    getCommentByIdService,
    delCommentService,
    getMomentComService
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
}
module.exports=new CommentController();