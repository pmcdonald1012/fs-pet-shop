import http from 'http';
import fs from "fs";




 let server = http.createServer((req, res) => {
    let url = req.url;
    const petRegExp = /^\/pets\/(.*)$/
    let match = url.match(petRegExp);
   
    
    if (req.url === '/pets' && req.method === "GET") {
        fs.readFile('pets.json', "utf-8", (err,data) => {
        res.statusCode = 200;
        res.writeHead(200, { "Content-Type": "application/json" }); 
        res.end(data)
       })  
    } else if (req.method === 'POST' && req.url === '/pets' ){
        let body = ''
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let newPet = JSON.parse(body);

            fs.readFile('pets.json', "utf-8", (err,data) => {
                let newData = JSON.parse(data);
                newData.push(newPet);
                console.log(newData);
                
                newData.push(newPet);
                fs.writeFile('pets.json', JSON.stringify(newData), (err) => {
                    console.log('it worked!')
                })
            })
        })
       
    const petRegExp = /^\/pets\/(.*)$/
   }  else if (match[1] == 0 && req.method === 'GET') {
       fs.readFile('pets.json', 'utf-8', (err,data) => {
          let parsedData = JSON.parse(data);
          res.statusCode = 200;
          res.writeHead(200, { "Content-Type": "application/json" }); 
          res.end(JSON.stringify(parsedData[0]));
       })
    } else if (match[1] == 1 && req.method === 'GET') {
        fs.readFile('pets.json', 'utf-8', (err,data) => {
           let parsedData = JSON.parse(data);
           res.statusCode = 200;
           res.writeHead(200, { "Content-Type": "application/json" }); 
           res.end(JSON.stringify(parsedData[1]));
        })
    } else if (req.method === 'GET' && (req.url === 'pets/-1' || req.url === 'pets/2')) {
        res.statusCode = 404;
        res.writeHead(404, { "Content-Type": "text/plain" }); 
        res.end('Not Found')
    }  else {
        res.statusCode = 404;
        res.writeHead(404, { "Content-Type": "text/plain" }); 
        res.end('Not Found')
    }
 })

 server.listen(8000, () => {
    console.log('listening on port 8000!');
 })

//  import http from "http";

// const server = http.createServer((req, res) => {
//     console.log("version", req.httpVersion);
//     console.log("headers", req.headers);
//     console.log("method", req.method);
//     console.log("url", req.url);
  
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk;
//     });
//     req.on("end", () => {
//       const data = JSON.parse(body);
//       res.end(data.age.toString());
//     });
  
//     res.statusCode = 400;
//     res.writeHead(400, { "Content-Type": "application/my-data" });
//     res.end("response");
//   });
  
//   server.listen(3000, () => {
//     console.log("listening on port 3000");
//   });
  
  
  
  
  
  
  
  
  
  
  
  
  