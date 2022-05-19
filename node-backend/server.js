const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const UserRole = require('./app/models/role.model');

mongoose.connect(`mongodb://localhost:27017/MeanDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
  initialUserRole();
})
.catch(err => {
  console.log("Connection error", err)
  process.exit();
});

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use('/', require('./app/routes'));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to App."})
});

const PORT = process.env.PORT || 8080;
app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API running on localhost: ${PORT}`)
});

function initialUserRole() 
{
  UserRole.estimatedDocumentCount((err, count) => 
  {
    if (!err && count === 0) {
      new UserRole({
        role_name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new UserRole({
        role_name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
