import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const arrayDatasCountries = [];
let searchCountry = '';

const refs = {
  inputEl: document.getElementById('search-box'),
  listEl: document.querySelector('.country-list'),
  containerEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onInputSearchCountries, DEBOUNCE_DELAY)
);

function onInputSearchCountries(e) {
  arrayDatasCountries.length = 0;

  searchCountry = e.target.value.toLowerCase().trim();
  if (!searchCountry) {
    removeEl();
    return;
  }

  fetchCountries()
    .then(processingsObjectCountries)
    .catch(error => console.log(error));
}

function renderContriesCard(country) {
  return country
    .map(({ flags, name, capital, population, languages }) => {
      return `
                <div class='flags-container'><img class="flags-img" src=${flags.svg} alt=${name.official} />
                    <h1>${name.official}</h1>
                </div>
                <div class='info-container'>
                    <ul class='info-list'>
                        <li>Capital: ${capital}</li>
                        <li>Population: ${population}</li>
                        <li>Languages: ${languages}</li>
                    </ul>
                </div>`;
    })
    .join('');
}
function renderContriesList(country) {
  return country
    .map(({ flags, name }) => {
      return `
                <li class='flags-container'><img class="flags-img" src=${flags.svg} alt=${name.official} />
                    ${name.official}
                <li>`;
    })
    .join('');
}

function processingsObjectCountries(countries) {
  countries.map(country => {
    if (country.name.common.toLowerCase().includes(searchCountry)) {
      arrayDatasCountries.push(country);
    }
  });
  console.log(arrayDatasCountries);
  removeEl();
  if (arrayDatasCountries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (arrayDatasCountries.length > 1) {
    refs.listEl.innerHTML = renderContriesList(arrayDatasCountries);
  } else if (arrayDatasCountries.length === 1) {
    refs.containerEl.innerHTML = renderContriesCard(arrayDatasCountries);
  } else {
    Notify.failure('Oops, there is no country with that name');
  }
}

function removeEl() {
  refs.listEl.innerHTML = '';
  refs.containerEl.innerHTML = '';
}
