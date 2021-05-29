const connection=require('../app/database');
const {
    APP_HOST,
    APP_PORT
}=require("../app/config")
class CommentService{
    async createService(momentId,content,userId){
        try{
            const id=new Date().getTime();
            const sql=`insert into comment (commentId,momentId,content,userId) values(?,?,?,?)`;
            const result=await connection.execute(sql,[id,momentId,content,userId]);
            return result[0];
        }catch (e)
        {
            console.log(e);  
        }
    }
    async getMomentBycomId(id)
    {
        try{
            const sql=`select * from comment where commentId=?`;
            const result=await connection.execute(sql,[id]);
            return result[0];
        }catch (e)
        {
            console.log(e)
        }
    }
    async replyService(commentId,content,userId){
        try{  
            const id=new Date().getTime();
            const res=await new CommentService().getMomentBycomId(commentId);
            const {momentId}=res[0];
            const sql=`insert into comment (commentId,momentId,content,userId,replyId) values(?,?,?,?,?)`;
            const result=await connection.execute(sql,[id,momentId,content,userId,commentId])
            return result[0];
        }catch (e)
        {
            console.log(e)          
        }
    }
    async getAllCommentService(offset,limit)
    {
        const sql=`
        select comment.commentId,comment.content,
        JSON_OBJECT('id',moment.momentId,'content',moment.content) as moment ,
        JSON_OBJECT('id',user.userId,'name',user.userName) as user,
        (select COUNT(replyId)
        from comment as m where comment.commentId=m.replyId ) as comment_reply
        from comment
        LEFT JOIN moment on comment.momentId=moment.momentId
        LEFT JOIN user on comment.userId=user.userId
        limit ?,?`
        const result=await connection.execute(sql,[offset,limit]);
        return result[0];
    }
    async getCommentByIdService(commentId)
    {
        const sql=`
        select comment.commentId,comment.content, comment.updateTime,
        JSON_OBJECT('id',moment.momentId,'content',moment.content) as moment ,
        JSON_OBJECT('id',user.userId,'name',user.userName) as user,
        (select JSON_ARRAYAGG(
        JSON_OBJECT('replyId',m.commentId,'replyContent',m.content,
            'user',(
                select JSON_OBJECT('id',u.userId,'name',u.userName)
        from user as u
        where u.userId=m.userId
        ),
        'updateTime',m.updateTime
         )
       ) 
        from comment as m
        where comment.commentId=m.replyId ) as reply 
        from comment
        LEFT JOIN moment on comment.momentId=moment.momentId
        LEFT JOIN user on comment.userId=user.userId
        where comment.commentId=?`
        const result=await connection.execute(sql,[commentId]);
        return result[0]
    }  
    async delCommentService(commentId)
    {
        const sql=`delete from comment where commentId=?`;
        const result=await connection.execute(sql,[commentId]);
        return result[0]
    }
    //获取动态评论
    async getMomentComService(momentId)
    {
        const sql=`
        select JSON_ARRAYAGG(JSON_OBJECT('commentId',c.commentId,'content',c.content,
                      'user',(select JSON_OBJECT('userId',c.userId,'userName',user.userName,'avatarUrl',user.avatarUrl) 
											        from user where user.userId=c.userId),
										 'createTime',c.createTime,
										 'reply',
                     (select JSON_ARRAYAGG(JSON_OBJECT('commentId',com.commentId,'content',com.content,
										 'user',(select JSON_OBJECT('userId',user.userId,'userName',user.userName,'avatarUrl',user.avatarUrl) 
										         from user where userId=com.userId),'createTime',com.createTime)) 
										  from comment as com where com.replyId=c.commentId))) as comments
        from comment as c
        LEFT JOIN moment on c.momentId=moment.momentId
        where c.replyId is null
        GROUP BY c.momentId
        HAVING c.momentId=?`;
        const result=await connection.execute(sql,[momentId]);
        return result[0]
    }
    //上传评论图片
    async uploadComImgService(filename,size,mimetype,originalname,destination){
        const id=new Date().getTime();
        const comId=new Date().getTime();
        const url=`${APP_HOST}:${APP_PORT}/comment/image?id=${id}`;
        const sql=`insert into comment_img(id,comId,picUrl,filename,size,mimetype,originalname,dest) values(?,?,?,?,?,?,?,?)`;
        const result=await connection.execute(sql,[id,comId,url,filename,size,mimetype,originalname,destination]);
        return {
            comId,
            url
        };
    }
    //获取评论图片
    async getCommentImgService(id){
        const sql=`select * from comment_img where id=?`;
        const result=await connection.execute(sql,[id]);
        return result[0];
    }
}
module.exports=new CommentService();