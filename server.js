const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Cody\'s Live Rides';

app.locals.rides = [
  {id: 1234, date: "6/13/2020", day: "Saturday", length: "30", title: "90s Pop", startTime: "7:00 am", countMeIn: false},
  {id: 2345, date: "6/14/2020", day: "Sunday", length: "45", title: "Interval & Arms Ride", startTime: "4:00 pm", countMeIn: false}
];

app.get('/', (request, response) => {
  response.send('Oh hey Boo');
});

app.get('/api/v1/rides', (request, response) => {
  const rides = app.locals.rides;

  response.json({ rides });
});

app.post('/api/v1/rides', (request, response) => {
  const { toggleRide } = request.body;

  const match = app.locals.rides.find(ride => {
    return ride.id === toggleRide.id;
  });

  match.countMeIn = !match.countMeIn;

  response.status(201).json({ id, name, type });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
