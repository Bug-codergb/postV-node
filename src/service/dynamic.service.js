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
}
module.exports=new DynamicService();