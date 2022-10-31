function fetchCountries() {
  const searchParams = 'name,capital,population,flags,languages';
  const url = `https://restcountries.com/v3.1/all?fields=${searchParams}`;
  return fetch(url).then(r => {
    if (!r.ok) {
      throw new Error(r.status);
    }
    return r.json();
  });
}

export { fetchCountries };
