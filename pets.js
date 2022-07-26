
import fs from 'fs'

let input = process.argv[2];
let subinput = process.argv[3];
let subsubinput = process.argv[4];
let subsubsubinput = process.argv[5];

if (input === 'read') {
   fs.readFile('pets.json', 'utf-8', (err, str) => {
    const data = JSON.parse(str);
        if (subinput > data.length) {
            console.log('error')
        } else {
            console.log(data[subinput])
        }
   })
} else if (input === 'create') {
    if (subinput !== undefined && subsubinput !== undefined && subsubsubinput !== undefined) {
        let object = {"age": parseInt(subinput), "kind": subsubinput, "name": subsubsubinput}
        addPet(object)
    } else {
        console.log("Usage: node pets.js create AGE KIND NAME")
    }

} else if (input === 'update') {
    if (subinput !== undefined && subsubinput !== undefined && subsubsubinput !== undefined) {
        let object = {"age": parseInt(subinput), "kind": subsubinput, "name": subsubsubinput}
        addPet(object)
    } else {
        console.log("Usage: node pets.js update AGE KIND NAME")
    }

} else if (input === 'destroy') {
   deleteItem(subinput);
} else {
    console.error('Usage: node pets.js [read | create | update | destroy]')
    process.exit(1)
}

function addPet (input) {
    fs.readFile('pets.json', 'utf-8', (err, str) => {
        const data = JSON.parse(str);
        data.push(input);
            fs.writeFile('pets.json', JSON.stringify(data), (err) =>{
                if(err) {
                    console.log(err)
                } else {
                    console.log('it worked!')
                }
            })
})
}
function deleteItem (index) {
    fs.readFile('pets.json', 'utf-8', (err, str) => {
        const data = JSON.parse(str);
         data.splice(index, 1);
        
            fs.writeFile('pets.json', JSON.stringify(data), (err) =>{
                if(err) {
                    console.log(err);
                } else {
                    console.log('destroyed!')
                }
            })
    })
}
