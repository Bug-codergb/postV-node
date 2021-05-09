// const WebSocket=require('ws');
// const wss=new WebSocket.Server({port:8200});
// let userId=1001;
// console.log("ww")
// wss.on('connection',(webSocket)=>{
//   webSocket.userId=userId+1;
//   webSocket.on('open',()=>{
//     webSocket.send("i am server");
//   })

//   webSocket.on('message',(data)=>{
//     console.log(data)
//     wss.clients.forEach(client=>{
//       if(client !== webSocket&&client.readyState===WebSocket.OPEN)
//       {
//         client .send(data);
//       }
//     })
//   })
// })
// module.export={
//   wss
// }