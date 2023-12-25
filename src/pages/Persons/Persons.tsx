import { Button, TextField } from '@mui/material';
import { useAppDispatch } from '../../libs/hooks';
import { ChangeEvent, useState } from 'react';
import { CheckActions } from '../../libs/store';
import { PersonCost } from '../../types/interfaces';
import PreviousButton from '../../shared/PreviousButton/PreviousButton';
import { useNavigate } from 'react-router-dom';
import TaxForReceipt from '../../components/TaxOptions/TaxForReceipt';

const Persons = () => {
	const dispatch = useAppDispatch();
	const [personsCost, setPersonsCost] = useState([
		{
			name: '',
			cost: 0,
		},
	] as PersonCost[]);
	const navigation = useNavigate();

	const changeInputHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, key: string) => {
		const personsCostCopy = [...personsCost];
		const personCost = personsCostCopy[index];
		switch (key) {
			case 'name':
				personCost.name = event.target.value;
				break;
			case 'cost':
				personCost.cost = +event.target.value || 0;
				break;
			default:
				break;
		}

		personsCostCopy[index] = personCost;
		setPersonsCost(personsCostCopy);
	};

	const addInputHandler = () => {
		const personsCostCopy = [...personsCost];
		personsCostCopy.push({
			name: '',
			cost: 0,
		});
		setPersonsCost(personsCostCopy);
	};

	const removeInputHandler = (index: number) => {
		const personsCostCopy = [...personsCost];
		personsCostCopy.splice(index, 1);
		setPersonsCost(personsCostCopy);
	};

	const handleFormSubmit = () => {
		dispatch(CheckActions.setPersonsCost(personsCost));
		dispatch(CheckActions.setSubTotal(personsCost.reduce((a, b) => a + b.cost, 0)));
		navigation('/receipt');
	};

	return (
		<main>
			<form onSubmit={handleFormSubmit}>
				<h1>Let's figure out who owes what</h1>
				<h3>How many people was there and how much do they spend?</h3>
				<div>
					{personsCost.map((person, index) => {
						return (
							<div key={index}>
								<TextField label='Person' value={person.name} onChange={(event) => changeInputHandler(event, index, 'name')} />
								<TextField label='Cost' value={person.cost} type='number' onChange={(event) => changeInputHandler(event, index, 'cost')} />
								{personsCost.length !== 1 && <Button onClick={() => removeInputHandler(index)}>-</Button>}
							</div>
						);
					})}
				</div>
				<Button variant='contained' onClick={addInputHandler}>
					Add Another Person
				</Button>

				<TaxForReceipt />

				<div>
					<PreviousButton />
					<Button variant='contained' type='submit'>
						Next
					</Button>
				</div>
			</form>
		</main>
	);
};

export default Persons;
