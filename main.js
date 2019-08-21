const api = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'

// fetch cities array and store it in response variable
let response;
fetch(api)
  .then( res => res.json())
  .then( data => response = data)
  .catch( err => console.log(`Error: ${err}`))


// searchIt function 
const searchIt = () => {

  //   stores input value and remove unnecessary spaces or tabs.
  const input = document.querySelector('#inputBox').value.trim().replace(/\s{1,}/, ' ');

  //   return an array containing cities or states that matches input
  const matchSearch = response.filter( obj => {

    // store city and state names in lowercase in order to match either lower or uppercase
    const city = obj.city.toLowerCase();
    const state = obj.state.toLowerCase();
    
    // input should be lower too
    const lowerInput = input.toLowerCase();

    if(city.startsWith(lowerInput) || state.startsWith(lowerInput)) {
      return true;
    }
    else {
      return false;
    }
    
  });

  //   a variable to store the output to be displayed
  let output = '';

  //   functions to format output to be displayed
  let matchToDisplay, populationToDisplay, growthToDisplay;
  
  if (input.length !== 0) {

    matchSearch.forEach(elt => {

    //     format the output to highlight the match keyword.
      matchToDisplay = el => {
        const lowerInp = input.toLowerCase(), lowercity = el.toLowerCase();
        const inputRegex = new RegExp(input, 'i');
        let matchInput = el.match(inputRegex) ? el.match(inputRegex)[0] : null;
        return lowercity.startsWith(lowerInp) ? el.replace(matchInput, `<span class='match'>${matchInput}</span>`) : el;
      };

    //     format the population to add a comma after three digits.
      populationToDisplay = el => {
        let temp = el.split('');
        const len = temp.length;
        for(let i = 3; i < len; i+=3) {
          temp.splice(len-i, 0, ',');
        }
        return temp.join('');
      };

    //     format the growth to be red or green depending on wether it is under or above zero.
      growthToDisplay = el => {
        let growth = el.split('%')[0];
        if (growth < 0) return `<span class='red'>${elt.growth_from_2000_to_2013}</span>`;
        else return `<span class='green'>${elt.growth_from_2000_to_2013}</span>`;
      };

      // store all the formatted outputs into the output variable.
      output += `<div>${matchToDisplay(elt.city)} &par; ${matchToDisplay(elt.state)} &par; ${populationToDisplay(elt.population)} &par; ${growthToDisplay(elt.growth_from_2000_to_2013)} </div>`;
    });
  }

  //   display the output the page into a div with result id.
  document.querySelector('#result').innerHTML = output;

  //   stores all div under the result div into divs array.
  const divs = [...document.querySelectorAll('#result div')];
  
  divs.forEach( (element) => {

    //  listen for click event on each city, if the city is clicked display its details.
    element.addEventListener('click', (event) => {
      
      //  display the modal.
      document.querySelector("#modalContainer").style.display = 'block';

      //  extract the content of the div.
      let content = event.target.textContent.split(' ∥ ');

      //  filter city which match the extracted content
      let ourMatch = response.filter(val => val.city == content[0] && val.state == content[1])[0];
      
      //  stores the additional details of a city into modalContent
      let modalContent = `
        <div><span class='props'>City</span>: ${ourMatch.city}</div>
        <div><span class='props'>Growth Rate</span>: ${growthToDisplay(ourMatch.growth_from_2000_to_2013)} </div>
        <div><span class='props'>Latitude</span>: ${ourMatch.latitude}</div>
        <div><span class='props'>Longitude</span>: ${ourMatch.longitude}</div>
        <div><span class='props'>Population</span>: ${populationToDisplay(ourMatch.population)}</div>
        <div><span class='props'>Rank</span>: ${ourMatch.rank}</div>
        <div><span class='props'>State</span>: ${ourMatch.state}</div>`;

      //  display the modalContent into the modal
      document.querySelector("#modalResults").innerHTML = modalContent;

      //  hide the modal if the close is clicked.
      document.querySelector("#closeModal").addEventListener('click', () => {
        document.querySelector("#modalContainer").style.display = 'none'
      });

      //  hide the modal if user hits Escape button.
      window.addEventListener('keydown', (e) => {
        e.keyCode == 27 ? document.querySelector("#modalContainer").style.display = 'none': null;
      });

      //  hide the modal if user clicks outside the modal.
      window.addEventListener('click', (e) => {
        if(e.target.className == 'modalContainer') {
          document.querySelector("#modalContainer").style.display = 'none';
        }
      })
    });
  });
};

// preventUnallowedKeys function
const preventUnallowedKeys = event => {
  
  //   this variable stores a Boolean, if key is allowed it stores true other wise false.
  //   allowed keys other than strings include [Backspace, Tab, Shift, Caps Lock, Space, End, Home, Arrow Keys, Delete] 
  const isAllowed = [8, 9, 16, 20, 32, 35, 36, 37, 39, 46, 123, 189, 191, 222].some( key => key == event.keyCode);
  
  //   this variable stores a Boolean, if key is string it stores true other wise false.
  const isString = event.keyCode >= 65 && event.keyCode <= 90;
  
  //   check if pressed key is not a string or it is not among allowed keys, 
  //   give the user a hint, then prevent the action.
  if(!isString && !isAllowed ) {
    document.querySelector('#inputHint').style.display = 'block';
    event.preventDefault();
  }
  else document.querySelector('#inputHint').style.display = 'none';

};

// listen for keyup and call searchIt function which will do the whole search functionalities
document.querySelector('#inputBox').addEventListener('keyup', searchIt);

// listen for keydown and call preventUnallowedKeys function which will prevent the action if it is not a string
document.querySelector('#inputBox').addEventListener('keydown', preventUnallowedKeys);
