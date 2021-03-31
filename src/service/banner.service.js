const connection = require('../app/database');
class BannerService {
  async getNewBannerService() {
    const sql = `select m.momentId,m.title,m.updateTime,m.type,playCount,
    (select vid from video where m.momentId=video.momentId) as vid,
   (select JSON_ARRAYAGG(JSON_OBJECT('picUrl',url)) from vioimg where vioimg.vid in  
                                             (select vid from video where m.momentId=video.momentId)) as picUrl,
   (select JSON_OBJECT('userId',user.userId,'userName',user.userName) from user where user.userId=m.userId) as user
   from moment as m
   LEFT JOIN video on video.momentId=m.momentId
   GROUP BY m.momentId
   ORDER BY video.playCount desc,m.createTime desc
   limit 0,8`
   const result=await connection.execute(sql);
   return result[0]
  }
  async getHotBannerService()
  {
    const sql=`
    select m.momentId,m.title,m.updateTime,m.type,count(view.momentId) as views,
       (select vid from video where m.momentId=video.momentId) as vid,
			 if(m.type=0,(select JSON_ARRAYAGG(JSON_OBJECT("picUrl",picture.picUrl)) 
			              from picture where picture.momentId=m.momentId),
									(select JSON_ARRAYAGG(JSON_OBJECT("picUrl",url)) from vioimg where vioimg.vid in  
									                              (select vid from video where m.momentId=video.momentId))) AS picUrl,
			(select JSON_OBJECT('userId',user.userId,'userName',user.userName) from user where user.userId=m.userId) as user
    from moment as m
    LEFT JOIN view on view.momentId=m.momentId
    GROUP BY m.momentId
    having picUrl is not null
    ORDER BY views desc
    limit 0,8`;
    const result =await connection.execute(sql);
    return result[0];
  }
}
module.exports = new BannerService()