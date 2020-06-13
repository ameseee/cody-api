const express = require('express');
const app = express();
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Cody\'s Live Rides';

let codyRides;

app.get('/', (request, response) => {
  response.send('Oh hey Boo');
});

app.get('/api/v1/rides', (request, response) => {

  function findCodyRides() {
    nightmare
      .goto('https://members.onepeloton.com/schedule/cycling')
      .wait(3000)
      .evaluate(function() {
        var classCards = document.querySelectorAll('li.sc-guDjWT.fOmymg');
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
          var id = `${day} ${time}`;

          return {id, description, time, day, countMeIn: false}
        });
      })
      .end()
      .then(function(rides) {
        codyRides = rides;
        response.json(rides);
      })
      .catch(function(error) {
        console.error('Search failed:', error);
      });
  }
  findCodyRides();
});

app.post('/api/v1/rides/:id', (request, response) => {
  const { toggleRide } = request.body;

  const match = codyRides.find(ride => {
    return ride.id === toggleRide.id;
  });

  match.countMeIn = !match.countMeIn;

  response.status(201).json({ id, name, type });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
