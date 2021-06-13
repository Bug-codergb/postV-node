const connection=require("../app/database");
class DynamicService{
    async getUserFollowService(userId){
        const desc="`desc`";
        const sql=`
        select u.userId,u.userName,u.createTime,u.updateTime,avatarUrl,${desc},auth,
       JSON_ARRAYAGG(JSON_OBJECT('userId',f.userId,'userName',
			 (select userName from user where f.userId=user.userId),'avatarUrl',
			  (select avatarUrl from user where f.userId=user.userId)	)) as follow
       from user as u
       LEFT JOIN fans as f on f.fanId=u.userId
       where u.userId=?`;
       const result=await connection.execute(sql,[userId]);
       return result[0];
    }
    //获取用户dynamic
    async getUserDynamicService(userId,cateId){
        const sql=`
        select momentId,(select JSON_OBJECT('userId',m.userId,'userName',userName,'avatarUrl',avatarUrl) 
                 FROM user as u where u.userId=m.userId) as user,
        content,createTime,updateTime,title,type,
				JSON_OBJECT('id',m.categoryId,'name',c.name) as category,
			 (select vid from video as v where v.momentId=m.momentId) as vid,
			 (select count(commentId) from comment as com where com.momentId=m.momentId and replyId is null) as comment,
			 (select count(userId) from thumbs as t where t.momentId=m.momentId) as thumb,
			 (select count(userId) from view as v where v.momentId=m.momentId) as view,
			 if(type=0,(select JSON_ARRAYAGG(picUrl) from picture as p where p.momentId=m.momentId),
			   (select JSON_ARRAYAGG(vi.url) from video LEFT JOIN vioimg as vi on vi.vid=video.vid 
				  where video.momentId=m.momentId)
			 ) as picUrl
        from moment as m
        LEFT JOIN category as c on c.categoryId=m.categoryId
        where m.status=1 and m.categoryId=? and m.userId=?
        ORDER BY createTime desc
        LIMIT 0,50`;
        const result=await connection.execute(sql,[cateId,userId]);
        return result[0];
    }
}
module.exports=new DynamicService();