import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { getDay } from '../services/CountryAPI';

const getModalStyle = () => {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
};

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: '70%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	},
	simpleModalDescription: {
		'font-family': 'Arial, Helvetica, sans-serif'
	},
	simpleModalTitle: {
		'font-family': 'Arial, Helvetica, sans-serif'
	},
	numbers: {
		marginLeft: 15
	}
}));

const CountryModal = ({ country, days }) => {
	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);
	const [] = React.useState();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	let countriesSorted = Object.entries(days).sort(
		(a, b) => new Date([b[0]]) - new Date([a[0]])
	);
	countriesSorted = countriesSorted.slice(0, 3);

	const calcPercentage = () => {
		const lastDay = countriesSorted[0];
		const prevDay = countriesSorted[1];
		const calc =
			Math.floor((lastDay[1].confirmed * 100) / prevDay[1].confirmed) - 100;
		return calc;
	};

	const body = (
		<div style={modalStyle} className={classes.paper}>
			<h2 className={classes.simpleModalTitle}>Las three days in {country}</h2>
			{countriesSorted.map(([day, data], idx) => {
				return (
					<p key={idx} className={classes.simpleModalDescription}>
						{day}:
						<span className={classes.numbers}>
							<strong>Confirmed:</strong>
							{data.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</span>
						<span className={classes.numbers}>
							<strong>Deaths:</strong>{' '}
							{data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</span>
					</p>
				);
			})}
			<p className={classes.simpleModalDescription}>
				{calcPercentage() === 0
					? 'No increments'
					: calcPercentage() > 0
					? `Increment of ${calcPercentage()}%`
					: `Decrement of ${calcPercentage()}%`}
			</p>
		</div>
	);

	return (
		<Fragment>
			<button className="modal-button" type="button" onClick={handleOpen}>
				{country}
			</button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				{body}
			</Modal>
		</Fragment>
	);
};

export default CountryModal;
