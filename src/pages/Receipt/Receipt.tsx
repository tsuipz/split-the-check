import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../libs/hooks';
import SplitReceipt from '../../components/Receipts/SplitReceipt/SplitReceipt';
import { SplitChoices } from '../../types/enums';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckActions } from '../../libs/store';
import PreviousButton from '../../shared/PreviousButton/PreviousButton';
import PersonsReceipt from '../../components/Receipts/PersonsReceipt/PersonsReceipt';

const Receipt = () => {
	const choice = useAppSelector((state) => state.checks.choice);
	const dispatch = useAppDispatch();
	const [receiptEl, setReceiptEl] = useState(<SplitReceipt />);
	const navigation = useNavigate();

	const handleResetClick = () => {
		dispatch(CheckActions.setInitialState());
		navigation('/');
	};

	useEffect(() => {
		switch (choice) {
			case SplitChoices.Split:
				setReceiptEl(<SplitReceipt />);
				break;
			case SplitChoices.Persons:
			case SplitChoices.SplitWithPersons:
				setReceiptEl(<PersonsReceipt />);
				break;
			default:
				break;
		}
	}, [choice]);

	return (
		<section>
			{receiptEl}
			<div>
				<PreviousButton />
				<Button variant='contained' onClick={handleResetClick}>
					Reset
				</Button>
			</div>
		</section>
	);
};

export default Receipt;
