import { useState, useEffect } from "react";

export default function useStats(url) {
	const [stats, setStats] = useState();
	useEffect(() => {
		async function fetchData() {
			const data = await fetch(url)
				.then(res => res.json())
				.catch(err => new Error(err));
			setStats(data);
		}
		fetchData();
	}, [url]);
	return stats;
}
