const { syncAndSeed, Museums } = require('./db')

// Create app using express
const express = require('express');
const app = express();

// require path module
const path = require('path');

app.use(express.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// GET route /
app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

// GET route /api/museums
app.get('/api/museums', async(req, res, next)=> {
  try {
    res.send(await Museums.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/museums/:id', async(req, res, next)=> {
    try {
      const museum = await Museums.findByPk(req.params.id);
      await museum.update(req.body);
      res.send(museum);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/museums', async(req, res, next)=> {
    try {
      res.send(await Museums.create(req.body));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/museums/random', async(req, res, next)=> {
    try {
      res.send(await Museums.createRandom());
    }
    catch(ex){
      next(ex);
    }
  });

const init = async() => {
    try {
      await syncAndSeed();
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`listening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
};

init();

