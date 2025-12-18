
const EventEmitter=require("node:events")
class loggerEmitter extends EventEmitter{

     log(msg){
        console.log(msg)
    }

}
const myEmitterObj=new loggerEmitter();

myEmitterObj.on("my event",()=>{
    console.log("an event ocured;")
})


// myEmitterObj.emit("event")

module.exports=loggerEmitter;