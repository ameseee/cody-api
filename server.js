const express = require('express');
const app = express();
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Cody\'s Live Rides';

let codyRides;

app.get('/', (request, response) => {
  response.send('Oh hey Boo');
});

function findCodyRides() {
  return nightmare
    .goto('https://members.onepeloton.com/schedule/cycling')
    .wait(6000)
    .evaluate(function() {
      // var classCards = document.querySelectorAll('[data-test-id]');
      var classCards = document.querySelectorAll('li.sc-goFBvh.jJrihd');
      var list = [].slice.call(classCards);

      var codyClasses = list.filter(function(cycleClass) {
        var instructorText = cycleClass.firstChild.lastChild.lastChild.innerText;
        var instructorName = instructorText.split("·")[0];

        return instructorName === "CODY RIGSBY";
      });

      return codyClasses.map(function(codyClass) {
        var description = codyClass.firstChild.lastChild.firstChild.innerText;
        var time = codyClass.firstChild.firstChild.firstChild.innerText;
        var day = codyClass.parentNode.parentNode.firstChild.innerText;
        var rideId = `${day} ${time}`;

        return {description, time, day, rideId, countMeIn: false}
      });
    })
    .end()
    .then(function(rides) {
      return rides;
    })
    .catch(function(error) {
      console.error('Search failed:', error);
    });
}

app.get('/api/v1/rides', async (request, response) => {

  try {
    var rides = await findCodyRides();

    //compare each of these against what is in the scheduledRides table, using rideId.
    // rides.map(ride => {
    //   if (rideId === storedRideId) {
    //     //if match, change .countMeIn to TRUE
    //     ride.countMeIn = true;
    //   }
    // });
    return response.json(rides);
  } catch(err) {
    console.log(err);
  }

});

app.get('/api/v1/count-me-in', async (request, response) => {
  try {
    const scheduledRides = await database('scheduled-rides').select();
    response.status(200).json(scheduledRides);
  } catch(error) {
    response.status(500).json({ error });
  }
});

app.post('/api/v1/count-me-in', (request, response) => {
  const ride = request.body;

  for (let requiredParameter of ['day', 'time', 'description']) {
    if (!ride[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { day: <String>, time: <String>, description: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  try {
    const id = await database('scheduled-rides').insert(ride);
    response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({ error });
  }
});

app.delete('/api/v1/count-me-in/:id', (request, response) => {
  //destroy the record assoc with the id that came through params
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
