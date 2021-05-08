const fs=require("fs");
function delFile(path)
{
  return new Promise((resolve,reject)=>{
    fs.unlink(path,(err)=>{
      if(!err)
      {
        resolve("success");
      }
      else {
        let err=new Error("fail");
        reject(err);
      }
    })
  })
}
module.exports={
  delFile
}