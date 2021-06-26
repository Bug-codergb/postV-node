const connection = require('../app/database')
class UserService {
    async createService(userName, password) {
        const userId = new Date().getTime();
        const sql = `insert into user (userId,userName,password) values (?,?,?)`;
        const result = await connection.execute(sql, [userId, userName, password]);
        return result[0]
    }
    //根据userId获取用户简略信息
    async getUserMsgByIdService(userId)
    {
        const desc=`'desc'`;
        const sql = `select userId,userName,createTime,updateTime,avatarUrl,${desc},auth,vip from user where userId=?`;
        const result = await connection.execute(sql, [userId]);
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
        where user.userId=? and status=1`;
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
        select user.userId,user.userName,vip,user.createTime,avatarUrl,${desc}, count(moment.momentId) as moments,
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
                                                          and thumbs.commentId is not null),
                     'channel',(select JSON_ARRAYAGG(JSON_OBJECT('cId',thumbs.cId)) FROM thumbs where user.userId=thumbs.userId 
                                                           and thumbs.cId is not null))
         ) as thumbs,
         (select JSON_OBJECT('moment',
                         (select JSON_ARRAYAGG(JSON_OBJECT('momentId',m.momentId,'title',m.title)) 
                                 from subscribe LEFT JOIN moment as m on m.momentId=subscribe.momentId 
                                 where subscribe.userId=user.userId and m.momentId is not null),
                                 'topicContent',
                                 (select JSON_ARRAYAGG(JSON_OBJECT('topic_content_id',topic_content_id,'title',topic_content.title))
                                 FROM subscribe LEFT JOIN topic_content on subscribe.topic_content_id=topic_content.id 
                                 where subscribe.userId=user.userId and topic_content_id is not null),
                                 'channel',(select JSON_ARRAYAGG(JSON_OBJECT('cId',s.cId,'title',c.title)) 
                                   FROM subscribe as s INNER JOIN channel as c on c.cId=s.cId
                                   where s.userId=user.userId)
                     )) as subscribe,
                     (select JSON_ARRAYAGG(JSON_OBJECT('topicId',topicId,'userId',userId)) from topic_user where topic_user.userId=user.userId) AS topic
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
        const desc='`desc`';
        try{
        const sql=`select fans.userId,user.userName,user.avatarUrl,${desc},count(fans.userId) as fanCount,
        JSON_ARRAYAGG(JSON_OBJECT('fanId',fanId,'fanName',fanName,
        'avatarUrl',(select avatarUrl from user where fanId=user.userId))) as fans
                    from fans
        LEFT JOIN user on user.userId=fans.userId
        GROUP BY fans.userId
        ORDER BY fanCount desc
        limit 0,15`;
        const result=await connection.execute(sql);
        return result[0]
        }catch(e)
        {
            console.log(e);
        }
    }
    //获取用户收藏
    async getUserSubService(userId)
    {
       try{
        const sql=`select JSON_ARRAYAGG(JSON_OBJECT('momentId',subscribe.momentId,'type',type,'title',title,
        'user',
        (select JSON_OBJECT('userId',moment.userId,'userName',userName,'avatarUrl',avatarUrl) from moment
				 LEFT JOIN user on user.userId=moment.userId where moment.momentId=subscribe.momentId ),
        'picUrl',
        if(type=0,(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) from picture where picture.momentId=subscribe.momentId),
                        (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url)) 
                                    from video LEFT JOIN vioimg on video.vid=vioimg.vid where video.momentId=subscribe.momentId) ),
                'vid',if(type=1, (select vid from video where subscribe.momentId=video.momentId) ,null),
                'updateTime',subscribe.createTime)) as moments,
            (select JSON_ARRAYAGG(JSON_OBJECT('topic_content_id',subscribe.topic_content_id,'topic',
                        (select JSON_OBJECT('topicId',topicId,'name',name) from topic where topic.topicId=tc.topicId)
                                ,'updateTime',
                        subscribe.createTime,'title',tc.title,'picUrl',(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
                                                                from topic_content_img as tci where tci.topic_content_id=tc.id	 ),
            'user',(select JSON_OBJECT('userId',tc.userId,'userName',user.userName,'avatarUrl',user.avatarUrl) FROM user where user.userId=tc.userId))
            ) as topic
        from subscribe
        LEFT JOIN topic_content as tc 
        on subscribe.topic_content_id=tc.id
        where subscribe.userId=? and topic_content_id is not null) as topicContent,
        (select JSON_ARRAYAGG(
				  JSON_OBJECT('id',s.cId,'title',c.title,'user',(select JSON_OBJECT(
															   'userId',c.userId,'userName',u.userName,'avatarUrl',u.avatarUrl
					                                       ) FROM user as u where u.userId=c.userId),
					            'picUrl',c.picUrl,'createTime',c.createTime)
				) from subscribe as s INNER JOIN channel as c on c.cId=s.cId where s.userId=?) as channel,
        (select JSON_OBJECT('userId',u.userId,'userName',u.userName,'avatarUrl',avatarUrl) from user as u where u.userId=subscribe.userId) as user
        from subscribe
        LEFT JOIN moment as m on m.momentId=subscribe.momentId
        where subscribe.userId=? and m.momentId is not null`;
        const result=await connection.execute(sql,[userId,userId,userId]);
        return result[0]
       }catch(e)
       {
           console.log(e)
       }
    }
    //获取用户加入的专题
    async getUserJoinTopicService(userId)
    {
        const sql=`select JSON_ARRAYAGG(JSON_OBJECT('topicId',tu.topicId,'name',name,'updateTime',updateTime,'description',description,'user',
        (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=leader),
        'picUrl',(select picUrl from topic_img as ti where ti.topicId=tu.topicId) )) as topic
        from topic_user as tu
        LEFT JOIN topic on topic.topicId=tu.topicId
        where userId=?`;
        const result=await connection.execute(sql,[userId]);
        return result[0]    
    }
    //添加用户简介
    async setUserDescService(userId,desc)
    {
        const description='`desc`'
        const sql=`update user set ${description}=? where userId=?`;
        const result=await connection.execute(sql,[desc,userId]);
        return result[0]
    }
    //获取用户其它专栏
    async getUserSpcolumnService(userId){
        const sql=`
        select m.momentId,title,m.createTime,m.updateTime,m.type,
       JSON_ARRAYAGG(p.picUrl) AS picUrl,(select JSON_OBJECT('id',sm.spId,'name',s.name) 
			 FROM spcolumn as s where s.id=sm.spId) as category 
       from moment as m
        INNER JOIN spcolumn_moment as sm on sm.momentId=m.momentId
        LEFT JOIN picture as p on p.momentId=m.momentId
        where m.userId=?
        GROUP BY m.momentId`;
        const result=await connection.execute(sql,[userId]);
        return result[0];
    }
    //获取所有用户
    async getAllUserService(offset,limit){
        const description='`desc`';
        const sql=`
        select userId,userName,createTime,updateTime,avatarUrl,${description},auth,vip
        from user	
        limit ?,?`;
        const result=await connection.execute(sql,[offset,limit]);
        return result[0];
    }
    //删除用户
    async delUserVice(userId){
      const sql=`delete from user where userId=?`;
      const result=await connection.execute(sql,[userId]);
      return result[0];
    }
    //获取用户头像文件信息
    async getUserAvatarFile(userId){
        const sql=`
        select a.userId,userName,mimetype,fileName,u.createTime,size
        from avatar as a
        LEFT JOIN user as u on u.userId=a.userId	
        where a.userId=?`;
        const result=await connection.execute(sql,[userId]);
        return result[0];
    }
    //用户上线
    async goesOnlineService(online,userId){
        const sql=`update user set online=? where userId=?`;
        const result=await connection.execute(sql,[online,userId]);
        return result[0];
    }
}
module.exports = new UserService();