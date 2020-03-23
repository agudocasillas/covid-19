import Head from "next/head";
import CountryTable from "../components/CountryTable";

export default function indexPage() {
	return (
		<div>
			<Head>
				<title>COVID-19</title>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
					key="viewport"
				/>
			</Head>
			<CountryTable />
		</div>
	);
}
