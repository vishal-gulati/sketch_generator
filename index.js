const express = require('express')
const { spawn } = require('child_process')
const app = express()
const path=require("path");
const ejs=require("ejs");
const multer = require('multer')

const upload = multer({
  dest: 'data',
  limits: {
    fileSize: 1000000,
  },
  
  fileFilter(req, file, cb) {
  
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
    cb(new Error('Please upload an image.'))
  }
    cb(undefined, true)
  }
})
  
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname,'public')));

app.post('/upload', upload.single('upload'), (req, res) => {
  if(req.file){
    try{
      console.log("File name",req.file.filename)
      const python = spawn('python', ['sketch.py',`data/`+req.file.filename])
      var output = ""
      python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...STARTS')
        console.log(data.toString())
        output += data.toString();
        console.log('Pipe data from python script ...ENDS')
      })
      python.stdout.on('close', function (code) {
          console.log('Closed with code ',code)
          res.render('pages/image',{data: "image.jpg"});
        })
      
    }catch(err){
      console.log(err)
      return res.render('pages/index')
    }
  

    
  }else{
    res.status(400).json({msg:"Img Not Received"})
  }
})

app.get('/check',(req,res)=>{
  console.log("Check Route")
  res.render('pages/image',{data: "image.jpg"});
})

app.get('/',(req,res)=>{
  console.log("Home Route")
  res.render('pages/index');
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})