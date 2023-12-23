import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../libs/hooks';
import { CheckActions } from '../../libs/store';
import { TextField } from '@mui/material';

const SubTotal = () => {
	const subTotal = useAppSelector((state) => state.checks.subTotal);
	const dispatch = useAppDispatch();
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleSubTotal = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = +event.target.value ?? 0;
		dispatch(CheckActions.setSubTotal(value));
		if (value <= 0) {
			setError(true);
			setErrorText('Please input a number greater than 0');
		} else {
			setError(false);
			setErrorText('');
		}
	};

	return (
		<section>
			<TextField label='Sub Total' type='number' value={subTotal} onChange={handleSubTotal} error={error} helperText={errorText} />
		</section>
	);
};

export default SubTotal;
