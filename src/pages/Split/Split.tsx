import { Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../libs/hooks';
import { ChangeEvent, useState } from 'react';
import { CheckActions } from '../../libs/store';
import TaxForReceipt from '../../components/TaxOptions/TaxForReceipt';
import { useNavigate } from 'react-router-dom';
import SubTotal from '../../components/SubTotal/SubTotal';
import PreviousButton from '../../shared/PreviousButton/PreviousButton';

const Split = () => {
	const splitAmount = useAppSelector((state) => state.checks.splitAmount);
	const dispatch = useAppDispatch();
	const navigation = useNavigate();
	const [errorSplitAmount, setErrorSplitAmount] = useState(false);
	const [errorSplitText, setErrorSplitText] = useState('');
	const handleSplitSelect = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = +event.target.value ?? 0;
		dispatch(CheckActions.setSplitAmount(value));
		if (splitAmount <= 0) {
			setErrorSplitAmount(true);
			setErrorSplitText('Please input a number greater than 0');
		} else {
			setErrorSplitAmount(false);
			setErrorSplitText('');
		}
	};

	const handleFormCheck = () => {
		if (!errorSplitAmount) {
			navigation('/receipt');
		}
	};

	return (
		<main>
			<form>
				<h1>Let's split the check</h1>
				<h3>How many people do we want to split with?</h3>
				<TextField
					label='Split'
					type='number'
					value={splitAmount}
					onChange={handleSplitSelect}
					error={errorSplitAmount}
					helperText={errorSplitText}
				/>

				<SubTotal />

				<TaxForReceipt />

				<PreviousButton />
				<Button variant='contained' onClick={handleFormCheck}>
					Next
				</Button>
			</form>
		</main>
	);
};

export default Split;
