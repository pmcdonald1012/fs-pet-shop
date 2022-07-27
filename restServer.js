import express from "express";
import { appendFile } from "fs";
// import fs, { appendFile } from "fs";
import { parse } from "path";
import { emitWarning } from "process";
import { pool }  from "./database.js";
import basicAuth from 'express-basic-auth'

const server = express();
server.use(express.json());


////////////////REST SERVER WITH DATABASE////////////////////

   //basic authentication 
   //If a request is found to not be authorized, it will respond with HTTP 401 and a configurable body (default empty).
   server.use(basicAuth({
      users: { 'admin': 'secretpassword' },
      challenge: true,
      realm: 'Required',
      unauthorizedResponse: responseOnUnauth,
   }))
   //to send a response body on unauthorized request
   function responseOnUnauth(req) {
      return req.auth
          ? ('Unauthorized')
          : 'No credentials provided'
   }
   //routes///
   server
      //general get
      .get("/pets", async (req, res) => {
         try { //if this works 
            const allPets = (await pool.query('SELECT * FROM pets ORDER BY id ASC')).rows;
            res.status(200);
            res.send(allPets)
         } catch (err) { //catch any errors
            console.error(err.message);
         }
      })
      //specified get request
      .get("/pets/:id", async (req, res) => {
         try {
            //create id 
            const id = parseInt(req.params.id);
            //
            const allPets = (await pool.query(`SELECT * FROM pets WHERE id = $1;`, [id])).rows;
            res.send(allPets[0])
         } catch (err) {
            console.error(err.message);
         }
      })
      //post request
      .post("/pets", async (req, res) => {
         try {
               //create a request body var
            let body = req.body;
            //references to each key
            let name = req.body["name"];
            let kind = req.body["kind"];
            let age = req.body["age"];
            //insert above values into database
            const createPet = (await pool.query('INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *',[name, kind, age]));
            //also return 
            res.send(createPet.rows[0]);
         } catch (error) {
         console.error(error.message);  
         }
      })
      //patch request
      .patch("/pets/:id", async (req, res) => {
         try {
            const { id } = req.params;
            //create a request body var
            let body = req.body;
            //references to each key
            const { name, kind, age} = body;
            //update desired row, COALESCE is used to filter any null values and will default to its second argument, in this case is nested query which will select the old value. 
            const updatePet = (await pool.query(`UPDATE pets SET 
               name = COALESCE($1,(SELECT name FROM pets WHERE id = $4)), 
               kind = COALESCE($2,(SELECT kind FROM pets WHERE id = $4)), 
               age = COALESCE($3,(SELECT age FROM pets WHERE id = $4)) 
               WHERE id = $4 RETURNING *`, 
               [name,kind,age, id] 
               ))
            //include returned value to response body
            res.send(updatePet.rows[0])
         } catch (error) {
            //catch any errors...
            console.error(error.message);
         }
      })
      .delete("/pets/:id",async (req, res) => {
         try {
            //access id 
            const id = req.params.id;
            //use a query to delete desired row where the ids match, remeber id > 0
            const deleteRow = (await pool.query('DELETE FROM pets WHERE id = $1 RETURNING *;',[id]));
               if (deleteRow.rows.length === 0) {
                  res
                  .sendStatus(404)
                  .send('no content');
               } else {
               res
               .status(200)
               .send(deleteRow.rows[0]);
               } 
         } catch (error) {
            console.error(error.message)
         }
      })
   .use("/boom", (req, res, err) => {
      res.status(500);
      res.send("Interanl Server Error");
   })















//////RESTFUL SERVER WITHOUT DATABASE
//hande requests with routes 


//catch all
// server.use("/pets/:id",(req, res, next) => {
//     let ID = req.params;
//     let id = ID["id"]
//     console.log('request recieved! Req ID: ' + id)
//     next();
// })


// //general get
//     server.get('/pets', (req, res) => {
//         //let us know we got the get Request
//         console.log('I got your get get request');
//         //read the pets file
//             fs.readFile('pets.json', 'utf-8', (err,data) => {
//                 //parse the daata
//                 let parsedData = JSON.parse(data);
//                 //set headers and send response
//                 res.statusCode = 200;
//                 res.set( "Content-Type", "application/json" ); 
//                 res.send(JSON.stringify(parsedData));
//             })    
//     })
// //specified get
//     server.get('/pets/:id', (req, res) => {
//         //access id var
//         let id = req.params.id;
//         //read pets file
//             fs.readFile('pets.json', 'utf-8', (err,data) => {
//                 //parse file data
//                 let parsedData = JSON.parse(data);
//                 //check to see if data is defined
//                 if (parsedData[id] === undefined){
//                         //if data is undefined...
//                         res.status(404);
//                         res.set('Content-type', "text/plain");
//                         res.send(new Error('Index Undefined') + "");
//                     } else {
//                         //if data is defined, set headers and send file data. 
//                         res.statusCode = 200;
//                         res.set( "Content-Type", "application/json" ); 
//                         res.send(JSON.stringify(parsedData[id]));
//                     } 
//             })    
//     })

// //post req
//     server.post('/pets', (req, res) => {
//         //set values for request body
//         let name = req.body["name"];
//         let age = req.body["age"];
//         let type = req.body["kind"];
//         //check request body value
//             if ((name || age || type) === undefined) {
//                 //if request body values are undefined, send error messsage
//                 res.status(400);
//                 res.set('Content-type', "text/plain");
//                 res.send('Bad Request')
//             } else {
//              //if request body values are defined ...
//              //read pets file
//              fs.readFile('pets.json','utf-8', (err, data) => {
//                 //parse data
//                 let parsedData = JSON.parse(data);
//                 //set request body age value to a number
//                 req.body['age'] = Number(req.body['age']);
//                 //push request body(input) into the outgoing writefile array
//                 parsedData.push(req.body);
//                 //update file with new array
//                     fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
//                         console.log("File is written")
//                     })
//                 //set headers and send updated body
//                 res.set('Content-type', "application/json");
//                 res.json(req.body)
//              })
//             }
//     })

// //patch req
//     server.patch('/pets/:id', (req, res) => {
//        //let us know if we got the request.
//        console.log("got your patch request")
//        //create input values
//        let reqName = req.body["name"];
//        let reqAge = req.body["age"];
//        let reqType = req.body["kind"];
//        let id = req.params.id
//        //read "database" file
//        fs.readFile('pets.json', 'utf-8', (err, data) => {
//             let parsedData = JSON.parse(data);
//             //specify what record using the id param
//             let currentAnimal = parsedData[id];
//             //create output values
//             let resName = currentAnimal["name"];
//             let resAge = currentAnimal["age"];
//             let resType = currentAnimal["kind"];
//             //check to see if values are valid
//             if (typeof(resAge) == "number" && resName && resType) {
//                 //check to see what values we need to update
//                     if (reqAge) {
//                         currentAnimal["age"] = reqAge;
//                     } else if (reqName) {
//                         currentAnimal["name"] = reqName; 
//                     } else if (reqType) {
//                         currentAnimal["kind"] = reqType;
//                     } 
//                     //update file
//                         fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
//                         console.log(`updated: ${JSON.stringify(currentAnimal)} to: ${JSON.stringify(parsedData[id])}` );
//                         })
//         }
//        })
//        res.status(200);
//        res.send('Updated!')
//     })

// //delete request
//     server.delete('/pets/:id', (req, res) => {
//         //let us know the request went through. 
//         console.log('We got your delete request');
//         //grab the id 
//         let id = req.params.id; 
//         //read our file
//         fs.readFile('pets.json', 'utf-8', (err, data) => {
//             //parse the data
//             let parsedData = JSON.parse(data);
//             //save this value before we delete it so we can reference it in our response
//             const dataToBeDeleted = parsedData[id];
//             //delete the desired value using the id param
//             parsedData.splice(id, 1);
//             //write to the new file with updated array
//             fs.writeFile('pets.json', JSON.stringify(parsedData), () => {
//                 //send a response with the deleted value
//                 res.status(200);
//                 res.send(`Deleted: ${JSON.stringify(dataToBeDeleted)}`)
//             })
//         })
//     })

// //catch any errors 
//     server.use((req, res, next) => {
//         res.status(404);
//         res.send(new Error('Domain does not exist') + "")
//     })


//listen on a port
    const port = 8000;
    server.listen(port, function() {
        console.log(`express server is running on port: ${port}`)
    })