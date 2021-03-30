const fs=require('fs');
const {
  createservice,
  createImgService,
  getMovieByIdService,
  setMovieImgUrlService,
  getAllMovieService
} = require("../service/movie.service");
class MovieController {
  async create(ctx, next) 
  {
    try {
      const { files } = ctx.req;
      const { userId } = ctx.user;
      const {movie}=ctx.req.body;
      let movies=[]
      for (let file of files) 
      {
        const { mimetype, filename, size } = file;
        const result = await createservice(userId, mimetype, filename, size,movie);
        movies.push(result);
      } 
      ctx.body =movies
    } catch (e) {
      console.log(e)
    }
  }
  //上传movie图片
  async createImg(ctx, next) {  
    const { files } = ctx.req;
    let {movieId}=ctx.query;
    movieId=JSON.parse(movieId)
    //console.log(movieId)
    for(let index in files)  
    {
      const{mimetype,filename,size}=files[index];
      const result=await createImgService(movieId[index].movieId,mimetype,filename,size);
    }
    ctx.body={  
      status:200
    }
  }
  //设置视频URL
  async setMovieUrl(ctx,next)
  {
    const {vid}=ctx.query;
    console.log(vid)
    const result=await getMovieByIdService(vid);
    const {fileName,mimetype}=result[0];
    ctx.set('content-type',mimetype)
    ctx.body=fs.createReadStream(`./upload/movie/${fileName}`)
  }
  //设置视频图片
  async setMovieImgUrl(ctx,next)
  {
    const {id}=ctx.query;
    const result=await setMovieImgUrlService(id);
    const {fileName,mimetype}=result[0];
    ctx.set('content-type',mimetype)
    ctx.body=fs.createReadStream(`./upload/movieImg/${fileName}`)
  }
  //获取全部视频
  async getAllMovie(ctx,next)
  {
    const {offset,limit}=ctx.query;
    const result=await getAllMovieService(offset,limit);
    ctx.body=result;
  }
}
module.exports = new MovieController()