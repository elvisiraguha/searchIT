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
  const matchSearch = response.filter( obj => {

    const city = obj.city.toLowerCase();
    const state = obj.state.toLowerCase();

    const inputRegex = new RegExp(input, 'i');

    const lowerCity = obj.city.toLowerCase().match(inputRegex) ? obj.city.toLowerCase().match(inputRegex)[0] : null;
    const lowerState = obj.state.toLowerCase().match(inputRegex) ? obj.state.toLowerCase().match(inputRegex)[0] : null;

    if(city.startsWith(lowerCity) || state.startsWith(lowerState)) {
      return true;
    }
    else {
      return false;
    }
    
  });
  let output = '';
  let match, population, growthToDisplay;
  if (input.length !== 0) {
    matchSearch.forEach(elt => {

      match = el => {
        const inputRegex = new RegExp(input, 'i');
        let matchInput = el.match(inputRegex) ? el.match(inputRegex)[0] : null;
        return el.replace(matchInput, `<span class='match'>${matchInput}</span>`)
      };

      population = el => {
        let temp = el.split('');
        const len = temp.length;
        for(let i = 3; i < len; i+=3) {
          temp.splice(len-i, 0, ',');
        }
        return temp.join('');
      };

      growthToDisplay = el => {
        let growth = el.split('%')[0];
        if (growth < 0) return `<span class='red'>${elt.growth_from_2000_to_2013}</span>`;
        else return `<span class='green'>${elt.growth_from_2000_to_2013}</span>`;
      };

      output += `<div>${match(elt.city)} :: ${match(elt.state)} :: ${population(elt.population)} :: ${growthToDisplay(elt.growth_from_2000_to_2013)} </div>`;
    });
  }
  document.querySelector('#result').innerHTML = output;
  const divs = [...document.querySelectorAll('#result div')]
  divs.forEach( (element) => {
    element.addEventListener('click', (event) => {
      document.querySelector("#modalContainer").style.display = 'block';
      let content = event.target.textContent.split(' :: ');
      let ourMatch = response.filter(val => val.city == content[0] && val.state == content[1])[0];
      let modalContent = '';
      modalContent += `
        <div><span class='props'>City</span>: ${match(ourMatch.city)}</div>
        <div><span class='props'>Growth Rate</span>: ${growthToDisplay(ourMatch.growth_from_2000_to_2013)} </div>
        <div><span class='props'>Latitude</span>: ${ourMatch.latitude}</div>
        <div><span class='props'>Longitude</span>: ${ourMatch.longitude}</div>
        <div><span class='props'>Population</span>: ${population(ourMatch.population)}</div>
        <div><span class='props'>Rank</span>: ${ourMatch.rank}</div>
        <div><span class='props'>State</span>: ${match(ourMatch.state)}</div>`;


      document.querySelector("#modalResults").innerHTML = modalContent;

      document.querySelector("#closeModal").addEventListener('click', () => {
        document.querySelector("#modalContainer").style.display = 'none'
      });
      window.addEventListener('click', (e) => {
        if(e.target.className == 'modalContainer') {
          document.querySelector("#modalContainer").style.display = 'none';
        }
      })
    });
  });
};

window.addEventListener('load', loader);
document.querySelector('#inputBox').addEventListener('keyup', searchIt);
