// console.log("minicdoe")
// console.log(__dirname)
// console.log(__filename)

// setTimeout(() => {
//     console.log("3 secend passed")
// }, 3000);




// var time=0
// var timer = setInterval(() => {
    
//         if (time>9) {
//             clearInterval(timer)
//         }
//     time +=2;
//     console.log(time)
// }, 2000);


// ---------------------------------------------------------

// var myfunc=function (params) {
//     console.log("this is my func")
// }

// global.myfunc()



// console.log(module)


// ----------------------------------------------------------
// var logger=require("./logger")
// logger.fun("javascript is funny")

// -----------------------------------------------------------


// const path =require("node:path")

// var pathObj=path.parse(__filename)
// console.log(pathObj)


// ---------------------------------------------------------------
// const os =require("node:os")
// // console.log(os.type)
// var freemem=os.freemem()
// var totalmen=os.totalmem()
// console.log(`
//     total memory is : ${totalmen} 
//      and free memory is  : ${freemem}
//      os type : ${os.type()}` )

// ------------------------------------------------------------------

// const fs= require("node:fs")
// const fileread=fs.readFileSync("./")
// console.log(fileread)


// fs.readdir("./", function (err, files) {
//     if (err) {
//         console.log("error is : ", +err)
//     }
//     else{
//         console.log(files)
//     }
// })

// --------------------------------------------------------------


// const EventEmitter=require("node:events")
// // class(oop)
// const emitter=new EventEmitter();




// register event listener
// emitter.on("myEvent" , function (params) {
    //     console.log("my event working")
    // })
    
    
    // rase on event 
    // emitter.emit("myEvent")
    


// const logger=require("./logger")
// logger.emit("my event")
// // asyncronise : dont block here and continue
// setTimeout(() => {
    
//     logger.logger("this is method log from loggerEmitter calss")
// }, 3000);


// -----------------------------------------------------
const { Socket } = require("dgram")
const http=require("http")
const server = http.createServer(function (req,res) {
    if(req.url==="/"){
        res.write("hello world ")
        res.end()
    }if(req.url==="/api/books"){
        res.write(JSON.stringify(["c++", "node js" , "web development"]))
        res.end()
    }
})
server.on("connection", (Socket)=>{
    console.log("new connection ")
})

server.listen(3000)
console.log("server is listening on 3000 port")