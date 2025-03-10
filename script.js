document.getElementById('search-btn').addEventListener('click', fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById('country-input').value.trim();
    const countryInfoSection = document.getElementById('country-info');
    const borderingCountriesSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    if (!countryName) {
        errorMessage.textContent = "Please enter a country name.";
        return;
    }

    errorMessage.textContent = "";
    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";

    try {
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }
        
        const countryData = await response.json();
        const country = countryData[0];

        // Extract country information
        const capital = country.capital ? country.capital[0] : "No capital";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flagURL = country.flags.png;
        const borders = country.borders || [];

        // Display country info
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${flagURL}" alt="Flag of ${country.name.common}">
            <p>Capital: ${capital}</p>
            <p>Population ${population}</p>
            <p>Region: ${region}</p>
        `;

        // Fetch bordering countries if they exist
        if (borders.length > 0) {
            borderingCountriesSection.innerHTML = "<h3>Bordering Countries:</h3>";

            for (const border of borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountriesSection.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}">
                    </div>
                `;
            }
        } else {
            borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}
