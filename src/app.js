'use strict'

const express = require('express'),
      cors = require('cors'),
      path = require('path'),
      app = express(),
      morgan = require('morgan')

// load routes
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')
const tagRoutes = require('./routes/tag')

// configure response
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json({
  limit: '20mb'
}));
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use(morgan('tiny'));

app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

// set public folder
//app.use('/gallery', express.static(path.join(__dirname, '../public/gallery')))
//app.use('/1',express.static(path.join(__dirname, '../public/dist/frontend-backoffice-chempo')));
// base routes

app.use('/api/v1',
  [
    userRoutes,
    taskRoutes,
    tagRoutes
  ]
)

app.get('/health', (req,res)=>{res.sendStatus(200)});

app.get('/uploads/*',async (req,res,next)=>{
  try {    
    let pathUrl = path.join(__dirname,('../public'+req.path));
    if(fs.existsSync(pathUrl)){
      res.status(200).sendFile(pathUrl);
    }else{
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);    
  } 
});

app.get('/*', function (req, res,next) {
  res.sendFile(path.join(__dirname))
});

module.exports = app
