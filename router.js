const nodeStatic = require('node-static');
const serveFile = new nodeStatic.Server('./UI');
const nodemailer = require("nodemailer");
const router = {};

function pageInitiator(request){
    if(request.headers.referer){
        return true;
    }
}

router.process = (req, res)=>{
    let requestURL = req.url.replace(/^\/+|\/+$/g, '');
    let endPoint = requestURL.split('/');
    if(!pageInitiator(req)){
        serveFile.serveFile('/index.html', 200, {'content-type':'text/html'}, req, res);
    }else if(req.url === '/index'){
        serveFile.serveFile('/index.html', 200, {'content-type':'text/html'}, req, res);
    }else{
        if(req.url.includes('.')){
            serveFile.serve(req, res);
        }else{
            serveFile.serveFile('/index.html', 200, {'content-type':'text/html'}, req, res);
        }
        
    }

};
router.form = (req, res)=>{
    if(req.method !== "POST"){
        res.end("Invalid request");
        return;
    }
    if(req.url !== "/form"){
        res.end("Invalid  request");
        return;
    }
    var body='';
    req.on('data', function(data){
        body +=data;
    });
    req.on('end', function(){
        let newBody;
        try{
            newBody = JSON.parse(body);
        }catch(error){
            res.end(JSON.stringify({result:"Only JSON is allowed"}));
            return;
        }
        if(typeof newBody.name === 'undefined'){
            res.end(JSON.stringify({result:"name is required"}));
            return;
        }
        if(newBody.name === ''){
            res.end(JSON.stringify({result:"name cannot be empty"}));
            return;
        }
        if(!/^[a-zA-Z0-9\s]+$/.test(newBody.name)){
            res.end(JSON.stringify({result:"Please input a name that best identify you"}));
            return;
        }
        if(newBody.name.length < 2 || newBody.name.length > 90){
            res.end(JSON.stringify({result:"Please input a name that best identify you"}));
            return;
        }
        if(typeof newBody.email === 'undefined'){
            res.end(JSON.stringify({result:"email is required"}));
            return;
        }
        if(newBody.email === ''){
            res.end(JSON.stringify({result:"email cannot be empty"}));
            return;
        }
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(newBody.email)){
            res.end(JSON.stringify({result:"Invalid email"}));
            return;
        }
        if(typeof newBody.mobile === 'undefined'){
            res.end(JSON.stringify({result:"mobile is required"}));
            return;
        }
        if(newBody.mobile === ''){
            res.end(JSON.stringify({result:"mobile cannot be empty"}));
            return;
        }
        if(!/^[0-9]+$/.test(newBody.mobile) || newBody.mobile.length < 8 || newBody.mobile.length >16){
            res.end(JSON.stringify({result:"Invalid mobile number"}));
            return;
        }
        if(typeof newBody.message === 'undefined'){
            res.end(JSON.stringify({result:"message is required"}));
            return;
        }
        if(newBody.message === ''){
            res.end(JSON.stringify({result:"message cannot be empty"}));
            return;
        }
        if(newBody.message.length < 10){
            res.end(JSON.stringify({result:"Please write us a proper message"}));
            return;
        }
        
        const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${newBody.name}</li>
        <li>Email: ${newBody.email}</li>
        <li>Phone: ${newBody.mobile}</li>
        </ul>
        <h3>Message</h3>
        <p>${newBody.message}</p>
    `;
        let transporter = nodemailer.createTransport({
            host: "mail.cenomedia.com",
            port: 587,
            secure: false,
            auth: {
                user: "increase@cenomedia.com", //generated by Mailtrap
                pass: "increase@21" //generated by Mailtrap
            },
            tls:{
                rejectUnauthorized:false
            }
          });
          
          let mailOptions = {
           from: `${newBody.name} <increase@cenomedia.com>`, // sender address
            to: 'engr.increase@gmail.com', // list of receivers
            subject: `New Message from Potential Client ${newBody.name}`, // Subject line
            // text: 'Hello world?', // plain text body
            html: output // html body
        };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            //   console.log(error);
            } else {
            //   console.log('Email sent: ' + info.response);
            }
          });
        res.end(JSON.stringify({result:"success"}));
    });
    
};

module.exports= router;


