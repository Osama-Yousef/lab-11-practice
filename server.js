'use strict';

// for making the server 

//************(reqier dotenv)*************\\

require('dotenv').config();
//********(reqier express function)********\\

const express = require('express')

//******(reqier superagent function)*******\\

const superagent = require('superagent')

//****************(Port)*******************\\

const PORT = process.env.PORT || 3030

//************(app variable)***************\\

const  app = express();
app.use(express.static('./public')); // to serve our static css files which are in public folder // for using ejs
app.use(express.json()); //to recognize the incoming Request Object as a JSON Object
app.use(express.urlencoded({extended:true})); // for using ejs // to recognize the incoming Request Object as strings or arrays
app.set('view engine', 'ejs'); // for using ejs

//*****************(test)*******************\\
// when we go to home page (route / ) then index page content  will render there
app.get('/' , (req,res)=>{
  res.render('./pages/index'); // path for index page 
})





// necessary to do  always // to make sure the index page contents will show in /index route
app.get('/index' , (req,res)=>{ // the route 
  res.render('./pages/index'); // the path of index file
})






// in the route , end point ( searches/new ) will contain/render the form which exists in (pages/searches/new) file
// now go to new.ejs file and make the form of searching 
app.get('/searches/new',(req,res)=>{
  res.render('./pages/searches/new');
})

//*****************(the main route)*******************\\


//********************(the search route)***********************\\

// here we will make api  request using superagent and return the books we searched for 
// the books will redered on /searches route but rendering process will be in searches/show(importaaaaant)
app.post('/searches',(request,response)=>{ // he wanted route handler with post type for /searches  
 
  // from google books api doc -- guides -- using api -- working with volumes we will see the http request
  // the request url will be : https://www.googleapis.com/books/v1/volumes?q=search+terms
  //example of searching for Daniel Keyes' "Flowers for Algernon":GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes
  // there are many parameters too to use such as :
  // 1)intitle: Returns results where the text following this keyword is found in the title.
  // 2)inauthor: Returns results where the text following this keyword is found in the author.

  // and we have the body of response 
 

 // so below we did 1+2+3 to use api request properly and to have different results when we search by title and author , (to not happen any duplicate results )
 
 
 
  const inputt = request.body.search; //1
  const radio = request.body.radio; //2
  let url = `https://www.googleapis.com/books/v1/volumes?q=${inputt}+in${radio}:${inputt}`; // to prevent mixed content occuring //3
  superagent.get(url) // using superagent to send api request and (get) cuz the url in doc of type GET
    .then(bookData =>{
      let dataArray = bookData.body.items.map(value =>{ // items is the name of array in the response // value will be used in const as parameter and maybe something else
        return new Book(value); // Book is the const 
      })
      response.render('./pages/searches/show',{data:dataArray}); //the path of folder which rendering process will exist // data is name from us which has all the dataArray and we will use (data)in rendering process (importantttt)
    }).catch((error) => {
      errorHandler(error, request, response);
    });

})

//********************(constructor)***********************\\
// making suitable constructor who contains the properties that we want from all the json file
// which is : image / title / author /description (will be on the left in const)(importanttt)
function Book (value){ // value refers to everything in case of itertions so we use it inside the const and starting the (تتبع) from it
  // we made if statement here because he want that if user search for a book which doesnot have image or cover image so the image of the book will be the picture which its link provided in lab 11 (the link is below )
  if(value.volumeInfo.imageLinks.smallThumbnail === null) { // التتبع صحيح للصوره
    this.image = 'https://www.freeiconspng.com/uploads/book-icon--icon-search-engine-6.png';// اللينك المعطى
  } else {
    this.image = value.volumeInfo.imageLinks.smallThumbnail;
  }
  this.title = value.volumeInfo.title; // التتبع صحيح ولما ننتقل من جيسون لجيسون اخر نضع نقطه واذا بدي اختار اشي جوا جيسون كمان بحط نقطه
  this.author= value.volumeInfo.authors[0]; // التتبع صح والاوثرز هي ارري
  this.description = value.volumeInfo.description; //التتبع صحيح
}
// Now go to searches/show to do rendering process




// for making the server
//************(listening to port)***********\\

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`)
})

//***************(error handler)**************\\

function errorHandler (err,req,res){
  res.status(500).send(err);
}


app.get('*',(req,res)=>{
    res.status(404).send('This route does not exist!!');
  })