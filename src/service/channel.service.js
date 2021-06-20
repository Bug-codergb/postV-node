const connection =require("../app/database");
const {
  APP_HOST,
  APP_PORT
}=require("../app/config")
class ChannelService{
  async createService(name){
    try{
      const id=new Date().getTime();
    const sql=`insert into channel_cate(id,name) values(?,?)`;
    const result=await connection.execute(sql,[id,name]);
    return result[0];
    }catch(e){
      console.log(e)
    }
  }
  //获取所有分类
  async getAllCateService(){
    try{
      const sql=`select * from channel_cate`;
    const result=await connection.execute(sql);
    return result[0];
    }catch(e){
      console.log(e);
    }
  }
  //添加分类内容
  async addCateConService(cateId,name){
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/channel/cate/con/cover?id=${id}`;
    const sql=`insert into channel_cate_con(id,name,cateId,coverUrl) values(?,?,?,?)`;
    const result=await connection.execute(sql,[id,name,cateId,url]);
    return result[0];
  }

  //添加专栏内容
  async addChannelService(title,content,userId,cateId){
    const id=new Date().getTime();
    const picUrl=`${APP_HOST}:${APP_PORT}/channel/cover?id=${id}`;
    const vidUrl=`${APP_HOST}:${APP_PORT}/channel/video?id=${id}`;
    const sql=`insert into channel(cId,title,content,userId,cateId,picUrl,vidUrl) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,title,content,userId,cateId,picUrl,vidUrl]);
    return id;  
  }
  //上传封面
  async uploadCoverService(cId,mimetype,destination,filename,size,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_cover(id,cId,fileName,size,mimetype,originalname,dest) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cId,filename,size,mimetype,originalname,destination]);
    return result[0];
  } 
  //获取封面文件信息
  async getChannelCoverService(cId){
    const sql=`select * from channel_cover where cId=?`;
    const result=await connection.execute(sql,[cId]);
    return result[0];
  } 
  //上传channel视频
  async uploadVideoService(cId,mimetype,dt,filename,destination,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_video(vid,cId,mimetype,duration,fileName,dest,originalName) values(?,?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cId,mimetype,dt,filename,destination,originalname]);
    return result[0];
  }
  //获取视频
  async getChannelVideoService(id){
    const sql=`select * from channel_video where cId=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //添加分类内容图片
  async addChannelCateCoverService(cate_con_id,filename,mimetype,destination,originalname){
    const id=new Date().getTime();
    const sql=`insert into channel_cate_con_img(id,cate_con_id,fileName,mimetype,dest,originalName) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,cate_con_id,filename,mimetype,destination,originalname]);
    return result[0];
  }
  //获取分类内容图片
  async getChannelCateCoverService(id){
    const sql=`select * from channel_cate_con_img where cate_con_id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0]
  }
  //获取子分类
  async getChannelCateConService(id){
    const sql=`select *
              from channel_cate_con
              where cateId=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //获取分类下（体育，搞笑）内容
  async getCateDetailService(cateId,offset,limit){
    const sql=`select id,name,coverUrl,c.createTime,c.updateTime,
              JSON_ARRAYAGG(JSON_OBJECT('cId',cId,'title',title,'content',content,'user',
              (select JSON_OBJECT('userId',channel.userId,'userName',userName,'avatarUrl',avatarUrl) 
              from user where user.userId=channel.userId),
              'picUrl',picUrl,'vidUrl',vidUrl,'createTime',channel.createTime,'updateTime',channel.updateTime)) as channels
              from channel_cate_con as c
              left join channel on channel.cateId=id
              where cId is not null and c.cateId=?
              group by id
              limit ?,?`;
    const result=await connection.execute(sql,[cateId,offset,limit]);
    return result[0];
  }
  //获取频道内容详情
  async getChannelDetailService(cId){
    const sql=`select c.cId,c.title,c.content,c.picUrl,c.createTime,c.updateTime,
    (select playCount from channel_video as cv where cv.cId=c.cId ) as playCount,
       JSON_OBJECT('id',cc.id,'name',cc.name,'coverUrl',cc.coverUrl) as category,
        JSON_OBJECT('userId',c.userId,'userName',user.userName,'avatarUrl',user.avatarUrl) AS user
        from channel as c
        LEFT JOIN channel_cate_con as cc on cc.id=c.cateId
        LEFT JOIN user on user.userId=c.userId
        where c.cId=?`;
    const result=await connection.execute(sql,[cId]);
    return result[0];
  }
  //获取频道内容播放地址
  async getChannelUrlService(cId){
    const sql=`select c.cId,c.vidUrl,cv.playCount,cv.duration 
            from channel as c
            LEFT JOIN channel_video as cv on cv.cId=c.cId
            where c.cId=?`;
    const result=await connection.execute(sql,[cId]);
    return result[0];
  }
  //发表频道内容评论
  async publishCommentService(cId,content,userId){
    const id=new Date().getTime();
    const sql=`insert into comment(commentId,content,userId,cId) values(?,?,?,?)`;
    const result=await connection.execute(sql,[id,content,userId,cId]);
    return result[0];
  }
  //获取子分类内容详情
  async getCateConDetailService(id,offset,limit){
    const sql=`
      select id,name,coverUrl,cc.createTime,cc.updateTime,
       JSON_OBJECT('id',cId,'title',title,'content',content,'picUrl',picUrl,'user',
       (select JSON_OBJECT('userId',channel.userId,'userName',userName,'avatarUrl',avatarUrl) 
       FROM user where user.userId=channel.userId)) AS channel
       from channel_cate_con as cc
       LEFT JOIN channel on cc.id=channel.cateId
        where id=?
        limit ?,?`;
    const result=await connection.execute(sql,[id,offset,limit]);
    return result[0];
  }
  //获取频道内容评论
  async getChannelCommentService(id,offset,limit){
    const sql=`select ch.cId,title,picUrl,ch.createTime,ch.updateTime,
       JSON_OBJECT('commentId',commentId,'content',c.content,'user',
               (select JSON_OBJECT('userId',c.userId,'userName',userName,'avatarUrl',avatarUrl) 
                 from user where user.userId=c.userId),
                   'createTime',c.createTime,'updateTime',c.updateTime,
                   'reply',(SELECT JSON_ARRAYAGG(
                   JSON_OBJECT('commentId',com.commentId,'content',com.content,'user',
                     (select JSON_OBJECT('userId',com.userId,'userName',userName,'avatarUrl',avatarUrl) 
                  FROM user where user.userId=com.userId))
                 ) from comment as com where com.replyId=c.commentId)) as comment
        from channel as ch 
        INNER JOIN comment as c on c.cId=ch.cId
        where ch.cId=?
        limit ?,?`;
    const result=await connection.execute(sql,[id,offset,limit]);
    return result[0]
  }
  //回复频道内容评论
  async replyCommentService(commentId,cId,content,userId){
    const id=new Date().getTime();
    const sql=`insert into comment(commentId,content,userId,replyId,cId) values(?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,content,userId,commentId,cId]);
    return result[0];
  }
  //点赞频道
  async thumbChannelService(cId,userId){
    const sql=`insert into thumbs(userId,cId) values(?,?)`;
    const result=await connection.execute(sql,[userId,cId]);
    return result[0];
  }
  //取消点赞
  async cancelThumbService(userId,cId){
    const sql=`delete from thumbs where userId=? and cId=?`;
    const result=await connection.execute(sql,[userId,cId]);
    return result[0];
  }
  //根据用户ID和频道ID获取频道信息
  async getChannelByUserService(cId,userId){
    const sql=`
    select cId,title,userId,picUrl,createTime,updateTime
    from channel
    where cId=? and userId=?`;
    const result=await connection.execute(sql,[cId,userId]);
    return result[0];
  }
  //获取频道视频和封面
  async getChannelFileService(cId){
    const sql=`
    select c.cId,title,userId,picUrl,createTime,updateTime,cc.fileName as coverFile, cv.fileName as videoFile
    from channel as c
    LEFT JOIN channel_cover as cc on cc.cId=c.cId
    LEFT JOIN channel_video as cv on cv.cId=c.cId
    where c.cId=?`;
    const result=await connection.execute(sql,[cId]);
    return result[0];
  }
  //删除频道
  async delChannelService(id){
    const sql=`delete from channel where cId=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //收藏频道
  async subChannelService(id,userId){
    const subId=new Date().getTime();
    const sql=`
    insert into subscribe(id,userId,cId) values(?,?,?)`;
    const result=await connection.execute(sql,[subId,userId,id]);
    return result[0];
  }
  //是否已经收藏频道
  async isSubService(id,userId){
    const sql=`select id,userId,cId from subscribe where cId=? and userId=?`;
    const result=await connection.execute(sql,[id,userId]);
    return result[0];
  }
  //取消收藏
  async cancelSubService(cId,userId){
    const sql=`
    delete from subscribe where cId=? and userId=?`;
    const result=await connection.execute(sql,[cId,userId]);
    return result[0];
  }
}
module.exports=new ChannelService();