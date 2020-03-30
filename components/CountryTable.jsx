import React, { useState, useEffect, Fragment } from 'react';
import MaterialTable, { MTableBody } from 'material-table';
import { resetServerContext } from 'react-beautiful-dnd';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ReactCountryFlag from 'react-country-flag';
import {
	getCountries,
	getSpecificCountry,
	getDay
} from '../services/CountryAPI';
import CountryModal from './CountryModal';

resetServerContext();

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			maxWidth: 1000,
			margin: '0 auto'
		},
		author: {
			width: '100%',
			textAlign: 'center',
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			fontSize: '13px',
			padding: '20px 0'
		}
	})
);

export default function CountryTable() {
	const classes = useStyles();
	const columns = [
		{
			title: 'Country',
			field: 'country',
			render: rowData =>
				rowData.short ? (
					<Fragment>
						<ReactCountryFlag countryCode={rowData.short} />
						{days[rowData.country] ? (
							<CountryModal
								country={rowData.country}
								days={days[rowData.country]}
								test={days}
							/>
						) : (
							''
						)}
					</Fragment>
				) : (
					`${rowData.country}`
				)
		},
		{
			title: 'Confirmed',
			defaultSort: 'desc',
			field: 'confirmed',
			render: rowData =>
				rowData.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
		{
			title: 'Deaths',
			field: 'deaths',
			render: rowData =>
				rowData.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
		{
			title: 'Recovered',
			field: 'recovered',
			render: rowData =>
				rowData.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
		{
			title: 'Still Sick',
			field: 'stillSick',
			render: rowData =>
				rowData.stillSick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		}
	];
	const [countries, setCountries] = useState([]);
	const [numRows, setNumRows] = useState(254);
	const [days, setDays] = useState({});

	useEffect(() => {
		const promiseDays = [1, 2, 3].map(getDay);

		Promise.all(promiseDays).then(res => {
			const final = res.flat().reduce((acc, curr) => {
				if (!curr.countryRegion) {
					return acc;
				}

				return {
					...acc,
					[curr.countryRegion]: {
						...(acc[curr.countryRegion] || {}),
						[curr.lastUpdate.split(' ')[0]]: {
							confirmed: acc[curr.countryRegion]
								? acc[curr.countryRegion][curr.lastUpdate.split(' ')[0]]
									? acc[curr.countryRegion][curr.lastUpdate.split(' ')[0]]
											.confirmed + parseInt(curr.confirmed)
									: parseInt(curr.confirmed)
								: parseInt(curr.confirmed),
							deaths: acc[curr.countryRegion]
								? acc[curr.countryRegion][curr.lastUpdate.split(' ')[0]]
									? acc[curr.countryRegion][curr.lastUpdate.split(' ')[0]]
											.deaths + parseInt(curr.deaths)
									: parseInt(curr.deaths)
								: parseInt(curr.deaths)
						}
					}
				};
			}, {});
			setDays(final);
		});

		getCountries().then(res => {
			const countriesArr = Object.entries(res.countries).reduce((acc, curr) => {
				const country = {
					country: curr[1].name,
					short: curr[1].iso2,
					iso3: curr[1].iso3 || ''
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
				isLoading={countries.length === 0}
				title="COVID-19 in the World"
				options={{
					pageSizeOptions: [100, 200, 254],
					pageSize: numRows,
					paging: false,
					exportButton: true
				}}
				columns={columns}
				data={countries}
			/>
			<div className={classes.author}>
				Author Alex Gudino <br /> Data taken from{' '}
				<a href="https://covid19.mathdro.id/api">covid19.mathdro.id/api</a>
			</div>
			<style jsx>{``}</style>
		</div>
	);
}
