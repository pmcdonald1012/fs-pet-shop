import express from "express";
import fs from "fs";
import { parse } from "path";
import { emitWarning } from "process";
const server = express();

server.use(express.json());
//hande requests with routes 


//catch all
// server.use("/pets/:id",(req, res, next) => {
//     let ID = req.params;
//     let id = ID["id"]
//     console.log('request recieved! Req ID: ' + id)
//     next();
// })


//general get
    server.get('/pets', (req, res) => {
        //let us know we got the get Request
        console.log('I got your get get request');
        //read the pets file
            fs.readFile('pets.json', 'utf-8', (err,data) => {
                //parse the daata
                let parsedData = JSON.parse(data);
                //set headers and send response
                res.statusCode = 200;
                res.set( "Content-Type", "application/json" ); 
                res.send(JSON.stringify(parsedData));
            })    
    })
//specified get
    server.get('/pets/:id', (req, res) => {
        //access id var
        let id = req.params.id;
        //read pets file
            fs.readFile('pets.json', 'utf-8', (err,data) => {
                //parse file data
                let parsedData = JSON.parse(data);
                //check to see if data is defined
                if (parsedData[id] === undefined){
                        //if data is undefined...
                        res.status(404);
                        res.set('Content-type', "text/plain");
                        res.send(new Error('Index Undefined') + "");
                    } else {
                        //if data is defined, set headers and send file data. 
                        res.statusCode = 200;
                        res.set( "Content-Type", "application/json" ); 
                        res.send(JSON.stringify(parsedData[id]));
                    } 
            })    
    })

//post req
    server.post('/pets', (req, res) => {
        //set values for request body
        let name = req.body["name"];
        let age = req.body["age"];
        let type = req.body["kind"];
        //check request body value
            if ((name || age || type) === undefined) {
                //if request body values are undefined, send error messsage
                res.status(400);
                res.set('Content-type', "text/plain");
                res.send('Bad Request')
            } else {
             //if request body values are defined ...
             //read pets file
             fs.readFile('pets.json','utf-8', (err, data) => {
                //parse data
                let parsedData = JSON.parse(data);
                //set request body age value to a number
                req.body['age'] = Number(req.body['age']);
                //push request body(input) into the outgoing writefile array
                parsedData.push(req.body);
                //update file with new array
                    fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
                        console.log("File is written")
                    })
                //set headers and send updated body
                res.set('Content-type', "application/json");
                res.json(req.body)
             })
            }
    })

//patch req
    server.patch('/pets/:id', (req, res) => {
       //let us know if we got the request.
       console.log("got your patch request")
       //create input values
       let reqName = req.body["name"];
       let reqAge = req.body["age"];
       let reqType = req.body["kind"];
       let id = req.params.id
       //read "database" file
       fs.readFile('pets.json', 'utf-8', (err, data) => {
            let parsedData = JSON.parse(data);
            //specify what record using the id param
            let currentAnimal = parsedData[id];
            //create output values
            let resName = currentAnimal["name"];
            let resAge = currentAnimal["age"];
            let resType = currentAnimal["kind"];
            //check to see if values are valid
            if (typeof(resAge) == "number" && resName && resType) {
                //check to see what values we need to update
                    if (reqAge) {
                        currentAnimal["age"] = reqAge;
                    } else if (reqName) {
                        currentAnimal["name"] = reqName; 
                    } else if (reqType) {
                        currentAnimal["kind"] = reqType;
                    } 
                    //update file
                        fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
                        console.log(`updated: ${JSON.stringify(currentAnimal)} to: ${JSON.stringify(parsedData[id])}` );
                        })
        }
       })
       res.status(200);
       res.send('Updated!')
    })

//delete request
    server.delete('/pets/:id', (req, res) => {
        //let us know the request went through. 
        console.log('We got your delete request');
        //grab the id 
        let id = req.params.id; 
        //read our file
        fs.readFile('pets.json', 'utf-8', (err, data) => {
            //parse the data
            let parsedData = JSON.parse(data);
            //save this value before we delete it so we can reference it in our response
            const dataToBeDeleted = parsedData[id];
            //delete the desired value using the id param
            parsedData.splice(id, 1);
            //write to the new file with updated array
            fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
                //send a response with the deleted value
                res.status(200);
                res.send(`Deleted: ${JSON.stringify(dataToBeDeleted)}`)
            })
        })
    })

//catch any errors 
    server.use((req, res, next) => {
        res.status(404);
        res.send(new Error('Domain does not exist') + "")
    })


//listen on a port
    const port = 8000;
    server.listen(port, function() {
        console.log(`express server is running on port: ${port}`)
    })