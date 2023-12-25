import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../libs/hooks';
import { SplitChoices } from '../../types/enums';
import { CheckActions } from '../../libs/store';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
	const choice = useAppSelector((state) => state.checks.choice);
	const dispatch = useAppDispatch();
	const navigation = useNavigate();

	const handleChoice = (event: SelectChangeEvent<SplitChoices>) => {
		const value: SplitChoices = event.target.value as SplitChoices;
		dispatch(CheckActions.setChoice(value));
	};

	const handleChoiceRoute = () => {
		navigation(choice);
	};

	return (
		<main>
			<h1>Welcome to Split The Check</h1>

			<FormControl fullWidth>
				<InputLabel id='demo-simple-select-label'>Split</InputLabel>
				<Select labelId='demo-simple-select-label' id='demo-simple-select' value={choice} label='Age' onChange={handleChoice}>
					<MenuItem value={SplitChoices.Split}>Split</MenuItem>
					<MenuItem value={SplitChoices.Persons}>Persons</MenuItem>
					<MenuItem value={SplitChoices.SplitWithPersons}>Split With Persons</MenuItem>
				</Select>
			</FormControl>
			<Button variant='contained' onClick={handleChoiceRoute}>
				Next
			</Button>
		</main>
	);
};

export default Homepage;
