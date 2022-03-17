// Create database using pg, sequelize
// To be moved to db.js later
const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/acme_react_redux")
// faker package is used to generate random museum names
const { faker } = require('@faker-js/faker');

const Museums = db.define('museum', {
    name: {
        type: Sequelize.STRING,
        UNIQUE: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    location: {
        type: Sequelize.STRING
    },

    hours: {
        type: Sequelize.TEXT
    },

    ticket: {
        type: Sequelize.TEXT
    },

    bio: {
        type: Sequelize.TEXT
    },

    website: {
        type:Sequelize.STRING,
        UNIQUE: true
    },

    booked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
});

Museums.createRandom = function(){
  return Museums.create({ name: faker.animal.bird()});
}

const syncAndSeed = async() => {
    await db.sync({ force: true });
    await Promise.all([
        Museums.create({ name: 'Long Island Children\'s Museum', location: '11 Davis Ave. Garden City, NY 11530', hours: 'Tuesday through Friday, 10am - 3pm Saturday and Sunday, 10am - 5pm', ticket: 'GENERAL ADMISSION $15, Members FREE, Under One Year FREE, 65 AND UP $14', bio: 'Free admission for up to four people (must include 1 adult and 1 child (does not have to be a family unit)). Library patrons DO NOT need to purchase or reserve online tickets with this pass. Library Pass Visitor Hours: Tuesday-Friday from 11 a.m. - 3 p.m and Saturday-Sunday from 11 a.m. to 5 p.m. This pass is good ONLY for admission during normal museum hours. No adults without children, nor children unaccompanied by an adult will be admitted. No other privileges, discounts, licenses or benefits are applicable. Not valid for complimentary nor discounted admission to theater performances, workshops or other special events. Museum restrictions may apply. This pass is NOT a printable pass. You must pick up and return the pass to the library.', website: 'https://www.licm.org/'}),
        Museums.create({ name: 'New York Hall of Science', location: '47-01 111th St, Queens, NY 11368', hours: 'Friday 2pm - 5pm Saturday 10am-5pm Sunday 10am-5pm', ticket: 'Adults: $14; Children, Students, Seniors: $11', bio: 'Admits 2 adults and up to 6 children to the museum. Pass holders receive family premium benefits during their visit. Pass includes discounts for 3D Theater, science shop, and café. Please print this confirmation page as your pass from home or come to the library and use one of our public computers to print the pass. You will need to bring the self-printed pass with you to the museum. Library patrons no longer need to make timed entry reservations.All visitors 5 and older need to wear a mask.', website: 'https://nysci.org/'}),
        Museums.create({ name: 'Museum of the Moving Image', location: '36-01 35 Ave, Astoria, NY 11106', hours: 'THURSDAY (STARTING MARCH 24) 2:00-6:00 P.M. FRIDAY 2:00-8:00 P.M. SATURDAY \& SUNDAY 12:00-6:00 P.M.', ticket: 'Adults(18+): $15; Youth(3-17): $9', bio: 'Admits 2 adults and up to 2 children. There is a 25 % discount on screenings and special events. Please print this confirmation page as your pass from home or come to the library and use one of our public computers to print the pass. You will need to bring the self-printed pass with you to the museum. Timed entry reservations are required for this museum. Enter the code LibraryPatron after reserving the pass to reserve your tickets http://www.movingimage.us/visit/ Select Member will call for delivery method.', website: 'https://movingimage.us/'}),
        Museums.create({ name: 'New York Botanical Garden', location: '2900 Southern Blvd., Bronx, NY 10458', hours: '10 a.m.-5 p.m.', ticket: 'Adults: $30; Students/Seniors (65+): $28; Child (2-12 years): $15; Children under 2: Free', bio: 'Admits a family of two adults and up to five children under 16 living in the same household. The pass does not cover parking fees. Patrons must present the valid membership card at any ticketing window in order to receive admissions tickets. This pass is NOT a printable pass. You must pick up and return the pass to the library. Timed entry tickets are required to enter the New York Botanical Garden and to attend events like the Orchid Show. To reserve time-entry tickets please call the Membership Office at 718.817.8703, Mon-Fri from 9am-5pm or Ticketing Support at 718.817.8716 available daily from 10am-5pm. Tickets reserved over the phone will be held for Will Call at any ticket window. You must have the reservation number and the Library pass with you. ', website: 'https://www.nybg.org/'}),
        Museums.create({ name: 'Long Island Explorium', location: '101 East Broadway, Port Jefferson, NY 11777', hours: 'Saturday through Sunday 1:00 - 5:00 PM', ticket: '$5 per person Members and children under 1 are free', bio: 'Pass admits up to 6 individuals during public hours. Timed entry reservations are not required but capacity will be limited. If capacity is reached, passes for that date will be honored at another time. Museum staff will note the name and date on the pass. Please print this confirmation page as your pass from home or come to the library and use one of our public computers to print the pass. You will need to bring the self-printed pass with you to the museum.', website: 'https://longislandexplorium.org/'})
    ]);
};


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

module.exports = {
    syncAndSeed,
    Museums
}