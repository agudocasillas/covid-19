const URL = "https://covid19.mathdro.id/api";

export const getCountries = () => {
	return fetch(`${URL}/countries`)
		.then(res => res.json())
		.catch(err => new Error(err));
};

export const getSpecificCountry = iso3 => {
	return fetch(`${URL}/countries/${iso3}`)
		.then(res => res.json())
		.catch(err => new Error(err));
};
