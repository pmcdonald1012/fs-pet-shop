import express from "express";
import fs from "fs";
import { parse } from "path";
import { emitWarning } from "process";
const server = express();

server.use(express.json());

//hande requests with routes 


//catch all
server.use("/pets/:id",(req, res, next) => {
    let ID = req.params;
    let id = ID["id"]
    console.log('request recieved! Req ID: ' + id)
    next();
})
server.get('/pets', (req, res) => {
        fs.readFile('pets.json', 'utf-8', (err,data) => {
            let parsedData = JSON.parse(data);
            res.statusCode = 200;
            res.set( "Content-Type", "application/json" ); 
            res.send(JSON.stringify(parsedData));
        })    
})
server.get('/pets/:id', (req, res) => {
    let ID = req.params;
    let id = ID["id"]
        fs.readFile('pets.json', 'utf-8', (err,data) => {
            let parsedData = JSON.parse(data);
            if (parsedData[id] === undefined){
                 res.status(404);
                 res.set('Content-type', "text/plain");
                 res.send(new Error('Index Undefined') + "");
                } else {
                    res.statusCode = 200;
                    res.set( "Content-Type", "application/json" ); 
                    res.send(JSON.stringify(parsedData[id]));
                } 
        })    
})
server.post('/pets', (req, res) => {
    let name = req.body["name"];
    let age = req.body["age"];
    let type = req.body["type"];
    if ((name || age || type) === undefined) {
        res.status(400);
        res.set('Content-type', "text/plain");
    }
     fs.readFile('pets.json','utf-8', (err, data) => {
       let parsedData = JSON.parse(data);
       req.body['age'] = Number(req.body['age']);
       parsedData.push(req.body);
       console.log(parsedData)
       fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
         console.log("File is written")
       })
       res.set('Content-type', "application/json");
       res.json(req.body)
     })
})


//catch any errors 

server.use((req, res, next) => {
    res.status(404);
    res.send(new Error(' Domain does not exist') + "")
})

//listen on a port
server.listen(8100, function() {
    console.log('express server is running on port 8100')
})