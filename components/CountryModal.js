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
		maxWidth: '350px',
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
	daysWrapper: {
		borderBottom: '1px solid #000000',
		marginBottom: 15
	},
	red: {
		background: 'red',
		padding: '5px',
		color: '#ffffff',
		textAlign: 'center',
		'font-family': 'Arial, Helvetica, sans-serif'
	},
	green: {
		background: 'green',
		padding: '5px',
		color: '#ffffff',
		textAlign: 'center',
		'font-family': 'Arial, Helvetica, sans-serif'
	},
	close: {
		'font-size': '20px',
		padding: '5px',
		position: 'absolute',
		top: '6px',
		right: '15px'
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
		const prevDay = countriesSorted[1] || lastDay;

		const calc = (lastDay[1].confirmed * 100) / prevDay[1].confirmed - 100;

		return calc.toFixed(2);
	};

	const body = (
		<div style={modalStyle} className={classes.paper}>
			<span className={classes.close} onClick={handleClose}>
				&times;
			</span>
			<h2 className={classes.simpleModalTitle}>Las three days in {country}</h2>
			{countriesSorted.map(([day, data], idx) => {
				return (
					<div className={classes.daysWrapper} key={idx}>
						<p className={classes.simpleModalDescription}>{day}:</p>
						<p className={classes.simpleModalDescription}>
							<span className={classes.numbers}>
								<strong>Confirmed:</strong>
								{data.confirmed
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							</span>
						</p>
						<p className={classes.simpleModalDescription}>
							<span className={classes.numbers}>
								<strong>Deaths:</strong>{' '}
								{data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							</span>
						</p>
					</div>
				);
			})}
			<p
				className={
					(classes.simpleModalDescription,
					calcPercentage() > 0 ? classes.red : classes.green)
				}
			>
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
