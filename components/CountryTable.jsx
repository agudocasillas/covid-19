import React, { useState, useEffect, Fragment } from "react";
import MaterialTable, { MTableBody } from "material-table";
import { resetServerContext } from "react-beautiful-dnd";
import { renderToString } from "react-dom/server";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ReactCountryFlag from "react-country-flag";
import { getCountries, getSpecificCountry } from "./CountryAPI";

resetServerContext();

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			maxWidth: 1000,
			margin: "0 auto"
		},
		author: {
			width: "100%",
			textAlign: "center",
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			fontSize: "13px",
			padding: "20px 0"
		}
	})
);

export default function CountryTable() {
	const classes = useStyles();
	const columns = [
		{
			title: "Country",
			field: "country",
			render: rowData =>
				rowData.short ? (
					<Fragment>
						<ReactCountryFlag countryCode={rowData.short} />
						{rowData.country}
					</Fragment>
				) : (
					`${rowData.country} ${rowData.short}`
				)
		},
		{
			title: "Confirmed",
			defaultSort: "desc",
			field: "confirmed",
			render: rowData =>
				rowData.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		{
			title: "Deaths",
			field: "deaths",
			render: rowData =>
				rowData.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		{
			title: "Recovered",
			field: "recovered",
			render: rowData =>
				rowData.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		{
			title: "Still Sick",
			field: "stillSick",
			render: rowData =>
				rowData.stillSick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}
	];
	const [countries, setCountries] = useState([]);
	const [numRows, setNumRows] = useState(254);

	useEffect(() => {
		getCountries().then(res => {
			const countriesArr = Object.entries(res.countries).reduce((acc, curr) => {
				const country = {
					country: curr[0],
					short: curr[1],
					iso3: res.iso3[curr[1]]
				};
				return [...acc, country];
			}, []);

			const promises = countriesArr.map(async country => {
				const { confirmed, recovered, deaths } = await getSpecificCountry(
					country.iso3
				).catch(err => {
					return {
						deaths: { value: 0 },
						confirmed: { value: 0 },
						recovered: { value: 0 },
						stillSick: { value: 0 }
					};
				});

				return {
					...country,
					deaths: deaths ? deaths.value : 0,
					confirmed: confirmed ? confirmed.value : 0,
					recovered: recovered ? recovered.value : 0,
					stillSick:
						(confirmed ? confirmed.value : 0) -
						(recovered ? recovered.value : 0) -
						(deaths ? deaths.value : 0)
				};
			});

			Promise.all(promises).then(countriesFullData => {
				setCountries(countriesFullData);
				setNumRows(countries.length);
			});
		});
	}, []);

	return (
		<div className={classes.root}>
			<MaterialTable
				components={{
					Body: props => <MTableBody {...props} />
				}}
				title="COVID-19 in the World"
				options={{
					pageSizeOptions: [100, 200, 254],
					pageSize: numRows,
					paging: false,
					exportButton: true,
					fixedColumns: {
						left: 1
					}
				}}
				columns={columns}
				data={countries}
			/>
			<div className={classes.author}>
				Author Alex Gudino <br /> Data taken from{" "}
				<a href="https://covid19.mathdro.id/api">covid19.mathdro.id/api</a>
			</div>
		</div>
	);
}
