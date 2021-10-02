const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const util = require('util');
const mm = require('musicmetadata');
// Create the app
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.get('/api/music', async (req,res) => {
  try{
      const files = fs.readdirSync(path.join(__dirname,'/public/audio'));
      const response = [];
      const promise = util.promisify(mm);
      for (const file of files) {
          const result = await promise(fs.createReadStream(path.join(__dirname,'/public/audio',file)));
          result.url = 'audio/' + file;
          response.push(result);
      }
      return res.status(200).json({files: response});
  }
  catch(error){
      console.log(error);
      return res.status(500).json(error);
  }
});

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Application listening at http://' + host + ':' + port);
}