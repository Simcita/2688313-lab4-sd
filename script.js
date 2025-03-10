document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const countryInput = document.querySelector('#country');
    const resultDiv = document.querySelector('#result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const countryName = countryInput.value.trim();
        if (!countryName) {
            displayError('Please enter a country name.');
            return;
        }

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            if (!response.ok) {
                throw new Error('Country not found');
            }
            const data = await response.json();
            const country = data[0];
            const neighbors = await fetchNeighbors(country.borders);

            displayCountryInfo(country, neighbors);
        } catch (error) {
            displayError(error.message);
        }
    });

    async function fetchNeighbors(borders) {
        if (!borders || borders.length === 0) {
            return [];
        }
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`);
        const data = await response.json();
        return data.map(country => ({
            name: country.name.common,
            flag: country.flags.png
        }));
    }

    function displayCountryInfo(country, neighbors) {
        resultDiv.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital}</p>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
            <h3>Neighbouring Countries:</h3>
            <ul>
                ${neighbors.map(neighbor => `
                    <li>
                        <img src="${neighbor.flag}" alt="Flag of ${neighbor.name}" width="50">
                        ${neighbor.name}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    function displayError(message) {
        resultDiv.innerHTML = `<p class="error">${message}</p>`;
    }
});