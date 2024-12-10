export async function fetchCountries() {
    const response = await fetch(
      "https://restcountries.com/v3.1/subregion/australia/?fields=name"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    return response.json();
  }