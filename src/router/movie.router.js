const Router =require('koa-router');
const movieRouter=new Router({prefix:'/movie'});
const {
  movieHandle,
  movieImgHandle
}=require('../middleware/file.middleware');
const {authVerify}=require('../middleware/auth.middleware');
const {
  create,
  createImg,
  setMovieUrl,
  setMovieImgUrl,
  getAllMovie
}=require('../controller/movie.controller')   
movieRouter.post('/upload',authVerify,movieHandle,create)
movieRouter.post('/img/upload',authVerify,movieImgHandle,createImg);
//设置视频url
movieRouter.get('/play',setMovieUrl);
//视频图片URL
movieRouter.get('/img',setMovieImgUrl);
//获取全部movie
movieRouter.get('/all',getAllMovie);
module.exports=movieRouter;