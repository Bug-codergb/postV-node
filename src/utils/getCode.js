const svgCaptcha=require("svg-captcha");
const getCode=()=>{
  let cpatcha=svgCaptcha.create({
    inverse:false,
    fontSize:48,
    noise:4,
    width:100,
    height:30,
    size:4,
    ignoreChars:'0000',
    color:'#3a8ee6'
  })
  return cpatcha
}
module.exports={
  getCode
}