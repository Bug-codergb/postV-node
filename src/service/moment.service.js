const connection = require('../app/database');
const { getCateNameByIdService } = require('./category.service');
class MomentService {
    async createService(momentId,userId, title, content, cate) {
        let type =1;
        const res=await getCateNameByIdService(cate);
        const {name}=res[0];
        if (name==='专栏') {
            type = 0
        }
        const sql = `insert into moment (momentId,userId,title,content,categoryId,type) values(?,?,?,?,?,?)`;
        const result = await connection.execute(sql, [momentId, userId, title, content, cate, type]);
        return momentId
    }
    //获取动态简略信息（单条）
    async getBriefMomentService(id)
    {
      const sql=`
        select m.momentId,title,m.userId,type,
        if(type=1,(select JSON_OBJECT('vid',vid,'video',v.fileName,'cover',vi.fileName) 
                        from vioimg as vi where vi.vid=v.vid ),
                        (select JSON_ARRAYAGG(JSON_OBJECT('pic',picture.fileName))
                                    from picture where picture.momentId=m.momentId )	) as file
        from moment as m
        left join video as v on v.momentId=m.momentId 
        where m.momentId=?`;
      const result=await connection.execute(sql,[id]);
      return result[0];
    }
    //获取单条动态
    async getMomentByIdService(momentId) {
        const sql = `select moment.momentId,title,moment.content,moment.createTime,moment.updateTime,type,
        (select JSON_OBJECT('categoryId',category.categoryId,'name',category.name) 
				from category where category.categoryId=moment.categoryId) as category,
        (select IF(type=0,(SELECT JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
                          from picture where moment.momentId=picture.momentId),
                         (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url)) 
                          from video LEFT JOIN vioimg on video.vid=vioimg.vid where video.momentId=moment.momentId)
                    )) as picUrl,
        (select JSON_ARRAYAGG(originalName) from picture where moment.momentId=picture.momentId) as originalNames,
                   JSON_OBJECT('id',user.userId,'name',user.userName,'avatarUrl',user.avatarUrl) as user,
                   JSON_ARRAYAGG(
                            JSON_OBJECT(
                                 'id',comment.commentId,'content',comment.content,
                                 'comment_user',(select JSON_OBJECT('id',user.userId,'name',user.userName,'avatarUrl',user.avatarUrl) as user 
                                 from user where user.userId=comment.userId),
                                 'updateTime',comment.updateTime
                           )
                       ) as comments,
                       (select JSON_ARRAYAGG(JSON_OBJECT('tagId',moment_tag.tagId,'tagName',tagName))
                        from moment_tag 
                        LEFT JOIN tag on tag.tagId=moment_tag.tagId 
                        where moment_tag.momentId=moment.momentId) as tags,
                        (select count(view.momentId) from view where view.momentId=moment.momentId GROUP BY view.momentId) as views,
                        (select JSON_ARRAYAGG(JSON_OBJECT('userId',s.userId,'userName',u.userName,'avatarUrl',u.avatarUrl)) 
                            from subscribe as s 
						    LEFT JOIN user as u on s.userId=u.userId
			                where s.momentId=moment.momentId
			                 GROUP BY s.momentId) as subscriber
                   from moment
                   LEFT JOIN user on moment.userId=user.userId
                   LEFT JOIN comment on moment.momentId=comment.momentId
                   where moment.momentId=? and replyId is null`;
        const result = await connection.execute(sql, [momentId]);
        //console.log("-------------------------------")
        //console.log(result[0])
        //console.log("-------------------------------------------------")
        return result[0]

    }
    //获取多条动态
    async getAllMomentService(offset, limit) {
        const sql = `select moment.momentId,title,moment.content,moment.updateTime,type,moment.status,
                          JSON_OBJECT('id',user.userId,'name',user.userName,'avatarUrl',user.avatarUrl) as user,count(comment.commentId) as comments,
                          (select vid from video where video.momentId=moment.momentId) as vid
                   from moment
                   LEFT JOIN user on moment.userId=user.userId
                   LEFT JOIN comment on comment.momentId=moment.momentId
                   GROUP BY momentId
                   HAVING moment.status=1
                   ORDER BY moment.createTime desc
                   LIMIT ?,?`;
        const result = await connection.execute(sql, [offset, limit]);
        return result[0];
    }
    //删除动态
    async delMomentService(momentId) {
        const sql = `delete from moment where momentId=?`;
        const result = await connection.execute(sql, [momentId]);
        return result[0];
    }  
    async getUserByIdService(id, source, userId) {
        /* console.log(source.tableName,source.field)*/
        try {
            const sql = `select * from ${source.tableName} where ${source.field}=? and userId=?`;
            const result = await connection.execute(sql, [id, userId]);
            return result[0]
        } catch (e) {
            console.log(e)
        }
    }
    async getRecMomentService() {
        const sql = `
        select thumbs.momentId,moment.content,moment.title,count(thumbs.momentId) as thumbs,
        (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) from picture where thumbs.momentId=picture.momentId) as pictures,
        (select JSON_OBJECT('userId',user.userId,'userName',user.userName) from user where user.userId=moment.userId) as user,
        moment.updateTime
        from thumbs
        LEFT JOIN moment on moment.momentId=thumbs.momentId
        GROUP BY moment.momentId
        HAVING thumbs.momentId is not null and pictures is not null
        ORDER BY thumbs desc
        limit 0,20`
        const result = await connection.execute(sql);
        return result[0]
    }
    async getHotMomentService(categoryId)
    {
        const sql = `
        select c.categoryId,c.name,
        (select JSON_OBJECT('id',mc.id,'name',mc.name) 
          from video INNER JOIN moment_cate as mc  on mc.id=video.categoryId  where video.momentId=moment.momentId) as cate,
       moment.momentId,moment.content,moment.title,moment.updateTime,
			  (select count(view.momentId) from view where view.momentId=moment.momentId) as views,
				(select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl) from user where user.userId=moment.userId) as user,type,
				if(type=0,(select JSON_ARRAYAGG(JSON_OBJECT('picUrl',picUrl)) 
														from picture where picture.momentId=moment.momentId),
														(select if(vioimg.url is null,null,JSON_ARRAYAGG(JSON_OBJECT('picUrl',vioimg.url))  )
														from video LEFT JOIN vioimg on vioimg.vid=video.vid where video.momentId=moment.momentId)) as picUrl,
                                                        if(type=1,(select JSON_OBJECT('vid',vid,'playCount',playCount,'duration',duration) 
				from video where video.momentId=moment.momentId),null) as video,
			  (select count(s.momentId) from subscribe as s where s.momentId=moment.momentId) as subs,
			  (select count(c.momentId) from comment as c where c.momentId=moment.momentId and c.replyId is null) as comments,
				(select count(t.momentId) from thumbs as t where t.momentId=moment.momentId) as thumbs
        from category as c
        LEFT JOIN moment on moment.categoryId=c.categoryId
        where c.categoryId=? and moment.status=1  
        GROUP BY momentId
        HAVING picUrl is not null
        ORDER BY views desc
        limit 0,6`
        const result = await connection.execute(sql,[categoryId]);
        return result[0]
    }
    //收藏动态  
    async subMomentService(momentId, userId) {
        const id = new Date().getTime();
        const sql = `insert into subscribe (id,momentId,userId) values(?,?,?)`
        const result = await connection.execute(sql, [id, momentId, userId]);
        return result[0];
    }
    //取消动态
    async cancelSubService(momentId, userId) {
        const sql = `delete from subscribe where momentId=? and userId=?`;
        const result = await connection.execute(sql, [momentId, userId]);
        return result[0]
    }
    //获取动态的点赞数，评论数，点击量
    async getDetailCountService(momentId) {
        const sql = `
        select m.momentId,count(view.momentId) as views,
             (select COUNT(thumbs.momentId) from thumbs where m.momentId=thumbs.momentId) as thumbs,
			 (select count(comment.momentId) from comment where comment.momentId=m.momentId and comment.replyId is null) as commentCount,
			 (select count(subscribe.momentId) from subscribe where subscribe.momentId = m.momentId) as subscriber
        from moment as m
        left JOIN view on m.momentId=view.momentId
        GROUP BY m.momentId
        HAVING m.momentId=?`;
        const result = await connection.execute(sql, [momentId]);
        return result[0];
    }
}
module.exports = new MomentService()