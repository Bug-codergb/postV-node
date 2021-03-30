const connection = require('../app/database')
class UserService {
    async createService(userName, password) {
        const userId = new Date().getTime();
        const sql = `insert into user (userId,userName,password) values (?,?,?)`;
        const result = await connection.execute(sql, [userId, userName, password]);
        return result[0]
    }
    async getUserNameService(userName) {
        const sql = `select * from user where userName=?`;
        const result = await connection.execute(sql, [userName]);
        return result[0]
    }
    //根据用户ID获取动态信息
    async getMomentByUserSeervice(userId) {
        const sql = `
        SELECT count(m.momentId) as count,
            JSON_ARRAYAGG(
			    JSON_OBJECT('id',m.momentId,'content',m.content,'updateTime',m.updateTime)
            ) as moments,
			 JSON_OBJECT('id',user.userId,'name',user.userName,'avatarUrl',user.avatarUrl) as user,
			 (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picture.picUrl)) from picture where m.momentId=picture.momentId ) as pictures
        from moment as m
        LEFT JOIN user on m.userId=user.userId
        where user.userId=?`;
        const result=await connection.execute(sql,[userId]);
        return result[0]
    }
    //关注用户  
    async followService(id,userName,userId)
    {
        const sql=`insert into fans(fanId,fanName,userId) values(?,?,?)`;
        const result=await connection.execute(sql,[id,userName,userId]);
        return result[0]
    }
    //取消关注
    async followCancelService(id,userId)
    {
        const sql= `delete from fans where fanId=? and userId=?`;
        const result=await connection.execute(sql,[id,userId]);
        return result[0]
    }
    //获取用户详情
    async getUserMsgService(userId)
    {
        const desc='`desc`'
       try{
        const sql=`
        select user.userId,user.userName,user.createTime,avatarUrl,${desc}, count(moment.momentId) as moments,
       (select JSON_ARRAYAGG(JSON_OBJECT('fanId',fanId,'fanName',fanName,'avatarUrl',
			                                  (select avatarUrl from user where user.userId=fans.fanId)
                                        )
														 )
        from fans where user.userId=fans.userId) as fans,
        (select JSON_ARRAYAGG(JSON_OBJECT('id',fans.userId,'name',
                                         (select userName from user where user.userId=fans.userId),'avatarUrl',
									                       (select avatarUrl from user where user.userId=fans.userId)
				                                 )
														 ) from fans where user.userId=fans.fanId) as follow,
        (JSON_OBJECT('moment',(select JSON_ARRAYAGG(JSON_OBJECT('momentId',thumbs.momentId)) from thumbs where user.userId=thumbs.userId
                                                         and thumbs.momentId is not null),
                    'comment',(select JSON_ARRAYAGG(JSON_OBJECT('commentId',thumbs.commentId)) from thumbs where user.userId=thumbs.userId 
                                                                         and thumbs.commentId is not null))
        ) as thumbs,
        (select JSON_ARRAYAGG(JSON_OBJECT('momentId',m.momentId,'title',m.title)) 
        from subscribe LEFT JOIN moment as m on m.momentId=subscribe.momentId 
          where subscribe.userId=user.userId) as subscribe
        from user LEFT JOIN moment on moment.userId=user.userId 
        GROUP BY user.userId
        HAVING user.userId=?`;
        const result=await connection.execute(sql,[userId]);
        return result[0];
       }catch(e)
       {
           console.log(e)  
       }
    }
    async getRecUserService()
    {
        const sql=`select fans.userId,user.userName,user.avatarUrl,count(fans.userId) as fanCount,
                 JSON_ARRAYAGG(JSON_OBJECT('fanId',fanId,'fanName',fanName,
                'avatarUrl',(select avatarUrl from user where fanId=user.userId))) as fans
                            from fans
        LEFT JOIN user on user.userId=fans.userId
        GROUP BY fans.userId
        ORDER BY fanCount desc
        limit 0,15`;
        const result=await connection.execute(sql);
        return result[0]
    }
}
module.exports = new UserService();