const api = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
let response;

const loader = () => {
  fetch(api)
  .then( res => res.json())
  .then( data => response = data)
  .catch( err => console.log(`Error: ${err}`))
}

const searchIt = () => {
  const input = document.querySelector('#inputBox').value.replace(/\s{1,}/, ' ');
  const match = response.filter( obj => obj.city.startsWith(input) || obj.state.startsWith(input));
  let output = '';
  if (input.length !== 0) {
    match.forEach(elt => {

      let population = (function() {
        let temp = elt.population.split('');
        const len = temp.length;

        for(let i = 3; i < len; i+=3) {
          temp.splice(len-i, 0, ',');
        }
        return temp.join('');
      }());

      let matchCity = (function(el) {
        let match = el.replace(input, `<span class='match'>${input}</span>`)
        return match;
      }(elt.city));

      let matchState = (function(el) {
        let match = el.replace(input, `<span class='match'>${input}</span>`)
        return match;
      }(elt.state));

      let growth = elt.growth_from_2000_to_2013.split('%')[0];
      let growthToDisplay;

      if (growth < 0) growthToDisplay = `<span class='red'>${elt.growth_from_2000_to_2013}</span>`;
      else growthToDisplay = `<span class='green'>${elt.growth_from_2000_to_2013}</span>`;

      output += `<div>${matchCity} :: ${matchState} :: ${population} :: ${growthToDisplay} </div>`;
    });
  }
  document.querySelector('#result').innerHTML = output;
};

window.addEventListener('load', loader);
document.querySelector('#inputBox').addEventListener('keyup', searchIt);