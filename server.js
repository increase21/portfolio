const https = require('http')
const router = require('./router')
const fs = require('fs')


// let port = process.env.NODE_ENV === 'dev' ? 4000 : 8443
let port = 6000
// const options = {

//   key: fs.readFileSync("./ssl/ceno.key"),
//   cert: fs.readFileSync("./ssl/ceno.crt"),
//   ca: fs.readFileSync('./ssl/ceno.ca-bundle')

// };
https.createServer((req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    let method = req.method; //get the method of the request
    if (method === 'GET') {
        // check if the request is on the home page and redirect to the index
        if (req.url === '/') {
            res.writeHead(302, { 'Location': './index' })
            res.end()
        }
        else{
            router.process(req, res)
        }
    } else if(method === 'POST'){
        router.form(req, res)
    }
}).listen(port, ()=>{
    console.log('Server is running on ' + port)
})

