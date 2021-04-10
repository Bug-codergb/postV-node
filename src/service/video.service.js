const connection=require('../app/database');
const {
  APP_PORT,
  APP_HOST
}=require('../app/config')
class VideoService{
  async createService(momentId,userId,mimetype,filename,size,duration)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/video?vid=${id}`;
    const sql=`insert into video (vid,url,momentId,userId,mimetype,fileName,size,duration) values(?,?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,url,momentId,userId,mimetype,filename,size,duration]);
    return id
  }
  async uploadVioImgService(vid,mimetype,filename,size)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/video/cover?vid=${vid}`;
    const sql=`insert into vioimg (id,vid,url,mimetype,fileName,size) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,vid,url,mimetype,filename,size]);
    return result[0];
  }
  //视频封面
  async getVideoCoverService(vid)
  {
    const sql=`select * from vioimg where vid=?`;
    const result=await connection.execute(sql,[vid]);
    return result[0]
  }
  //根据ID获取视频
  async getVideoByIdService(vid)
  {
    const sql=`select * from video where vid=?`;
    const result=await connection.execute(sql,[vid]);
    return result[0]
  }
  //获取所有视频
  async getAllVideoService(limit,offset)
  {
    const sql=`
    select v.vid,i.url as coverUrl,playCount,v.updateTime,
       (select JSON_OBJECT('userId',userId,'userName',userName,'avatarUrl',avatarUrl)
        from user where v.userId=user.userId) as user,
       (select title from moment where moment.momentId=v.momentId) as title,
       (select JSON_OBJECT('categoryId',categoryId,'name',name) from video_cate where v.categoryId=video_cate.categoryId ) as category,
       (select name from video LEFT JOIN moment on video.momentId=moment.momentId 
        LEFT JOIN category as c on c.categoryId=moment.categoryId where video.vid=v.vid) as name
    from video as v
    left JOIN vioimg as i on v.vid=i.vid
    LIMIT ?,?`
   const result=await connection.execute(sql,[offset,limit]);
   return result[0];
  }
  //获取视频详情
  async getVideoDetailService(vid)  
  {
    const sql=`
       select v.vid,v.url,v.updateTime,vi.url as coverUrl,v.playCount,
       (select JSON_OBJECT('momentId',v.momentId,'title',moment.title,'moment.content',moment.content) 
			  from moment where v.momentId=moment.momentId) as moment,
				(select JSON_OBJECT('userId',u.userId,'userName',u.userName,'avatarUrl',u.avatarUrl) from user as u where u.userId=v.userId) as user
      from video as v
      LEFT JOIN vioimg as vi on v.vid=vi.vid
      where v.vid=?`
      const result=await connection.execute(sql,[vid]);
      return result[0];
  }
  //添加视频播放量
  async addPlayCountService(vid)
  {
    try{
      const res=await new VideoService().getVideoByIdService(vid);
      const {playCount}=res[0];
      const sql=`update video set playCount=? where vid=?`;
      const result=await connection.execute(sql,[playCount+1,vid]);
      return result[0]
    }catch(e){
      console.log(e)
    }
  }  
  //添加视频分类
  async addVideoCateService(name)
  {
    const id=new Date().getTime();
    const sql=`insert into video_cate (categoryId,name) values(?,?)`;
    const result=await connection.execute(sql,[id,name]);
    return result[0]
  }
  //获取视频分类
  async getVideoAllCateService()
  {
    const sql=`select * from video_cate`;
    const result=await connection.execute(sql);
    return result[0];
  }
  //为视频添加cate
  async addCateForVioService(vid,categoryId)
  {  
    const sql=`update video set categoryId=? where vid=?`;
    const result=await connection.execute(sql,[categoryId,vid]);
    return result[0]
  }  
  //获取cate下视频
  async getCateVideoService(categoryId)
  {
    const sql=`
    select video_cate.categoryId,video_cate.name, 
       JSON_ARRAYAGG(JSON_OBJECT('vid',video.vid,'updateTime',video.updateTime,'playCount',playCount,
       'title',(select title from moment where moment.momentId=video.momentId),
			 'coverUrl', (select vioimg.url from vioimg where video.vid=vioimg.vid),
			 'user',(select JSON_OBJECT('userId',user.userId,'userName',user.userName,'avatarUrl',avatarUrl) from user where user.userId=video.userId)	
			 )) as videos
    from video_cate 
    LEFT JOIN video on video_cate.categoryId=video.categoryId
    GROUP BY video_cate.categoryId
    HAVING video_cate.categoryId=?`;
    const result=await connection.execute(sql,[categoryId]);
    return result[0]
  }
  //获取推荐视频
  async getCommVideoService()
  {
    const sql=`select video.vid,updateTime,momentId,playCount,categoryId,vi.url as coverUrl,duration,
    (select JSON_OBJECT('userId',video.userId,'userName',userName,'avatarUrl',avatarUrl) 
    from user where user.userId=video.userId) as user ,
    (select title from moment where moment.momentId=video.momentId) as title
    from video
    LEFT JOIN vioimg as vi on vi.vid=video.vid
    where categoryId is not null
    ORDER BY playCount desc
    limit 0,15`;
    const result=await connection.execute(sql);
    return result[0]
  }
}
module.exports=new VideoService()
