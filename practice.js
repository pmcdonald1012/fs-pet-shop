import fs from "fs"
import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    // YOUR CODE HERE
    fs.readFile("pets.json", "utf-8", (err, str) => {
        res.send(str)
    })

})

app.listen(8000, () => {
    console.log('listening on port 8000');
})
