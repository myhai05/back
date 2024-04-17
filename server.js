const http = require('http');
const app = require('./app');


const server = http.createServer(app);


server.listen(3031, ()=>{
    console.log("Server is runing at localhost 3031");
});