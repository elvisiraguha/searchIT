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
      let population = elt.population;
      let growth = elt.growth_from_2000_to_2013.split('%')[0];
      if (growth < 0) {
        output += `<div>${elt.city}, ${elt.state}, ${elt.population}, <span class='red'>${elt.growth_from_2000_to_2013}</span> </div>`;
      }
      else {
        output += `<div>${elt.city}, ${elt.state}, ${elt.population}, <span class='green'>${elt.growth_from_2000_to_2013}</span> </div>`;
      }
    });
  }
  document.querySelector('#result').innerHTML = output;
};

window.addEventListener('load', loader);
document.querySelector('#inputBox').addEventListener('keyup', searchIt);