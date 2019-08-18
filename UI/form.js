
(function(){
    function processForm(){
        var formOne = document.querySelector('#reused_form')
        formOne.addEventListener('submit', function(e){
            e.preventDefault()
           var name = document.querySelector('#form_name').value
           var phone = document.querySelector('#form_mobile').value
           var email = document.querySelector('#form_email').value
           var message = document.querySelector('#form_message').value
           if(name.length < 4 || name.length > 90){
               $('#error_message').show();
               document.querySelector('#error_message').textContent = 'Please input a proper Name';
               return;
           }
           $('#error_message').hide();
           if(!/^[0-9]+$/.test(phone) || phone.length < 8 || phone.length >16){
               $('#error_message').show();
               document.querySelector('#error_message').textContent = 'Please input a proper Mobile number';
               return;
           }
           $('#error_message').hide();
           var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
           if(!re.test(email)){
               $('#error_message').show();
               document.querySelector('#error_message').textContent = 'Please input a valid email address';
               return;
           }
           $('#error_message').hide();
           if(message.length < 10){
               $('#error_message').show();
               document.querySelector('#error_message').textContent = 'Your message should contain more characters';
               return;
           }
           $('#error_message').hide();
           let sendData = {
               name:name,
               email:email,
               mobile:phone,
               message:message
           }
           document.querySelector('#cSend').textContent = 'Sending'
           $.ajax({
                   type: "POST",
                   url: '/form',
                   data: JSON.stringify(sendData),
                   dataType: 'json' ,
                   success: function(data){
                       if(data.result === "success"){
                           $('#success_message').show();
                           document.querySelector('#success_message').textContent = "Your Message was sent successfully";
                            document.querySelector('#form_name').textContent = ""
                            document.querySelector('#form_mobile').textContent = ""
                            document.querySelector('#form_email').textContent = ""
                            document.querySelector('#form_message').textContent = ""
                       }else{
                           document.querySelector('#cSend').textContent = 'Send Message';
                           $('#error_message').show();
                           document.querySelector('#error_message').textContent = data.result;
                           return;
                       }
                       
                   }
               });
        })
    }
    processForm()
   })()