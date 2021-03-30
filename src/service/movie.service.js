const connection=require('../app/database');
const {
  APP_PORT,
  APP_HOST
}=require('../app/config')
class MovieService{
  async createservice(userId,mimetype,fileName,size,title)
  {
    const id =new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/movie/play?vid=${id}`
    const sql=`insert into movie(vid,title,url,userId,mimetype,fileName,size) values(?,?,?,?,?,?,?)`;
    const result= await connection.execute(sql,[id,title,url,userId,mimetype,fileName,size]);
    return {
      movieId:id
    }
  }
  //插入图片
  async createImgService(vid,mimetype,fileName,size)
  {
    const id=new Date().getTime();
    const url=`${APP_HOST}:${APP_PORT}/movie/img?id=${id}`;
    const sql=`insert into movie_img(id,vid,picUrl,mimetype,fileName,size) values(?,?,?,?,?,?)`;
    const result=await connection.execute(sql,[id,vid,url,mimetype,fileName,size]);
    return result[0]
  }
  //获取视频信息BY id
  async getMovieByIdService(vid)
  {
    const sql=`select * from movie where vid=?`;
    const result=await connection.execute(sql,[vid]);
    return result[0]
  }
  //获取视频封面信息BY id
  async setMovieImgUrlService(id)
  {
    const sql=`select * from movie_img where id=?`;
    const result=await connection.execute(sql,[id]);
    return result[0];
  }
  //获取全部movie
  async getAllMovieService(offset,limit)
  {
   try{
    const sql=`
    select movie.vid,title,url,picUrl as coverUrl,playCount
    from movie
    LEFT JOIN movie_img on movie.vid=movie_img.vid
    limit ?,?`;
    const result=await connection.execute(sql,[offset,limit]);
    return result[0]
   }catch(e)
   {
     console.log(e)
   }
  }
}
module.exports=new MovieService();