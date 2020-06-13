var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });

async function findCodyRides() {
  nightmare
    .goto('https://members.onepeloton.com/schedule/cycling')
    .wait(5000)
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

        return {description, time, day}
      });
    })
    .end()
    .then(function(result) {
      console.log(result);
      return result;
    })
    .catch(function(error) {
      console.error('Search failed:', error);
    });
}

module.exports = findCodyRides;
