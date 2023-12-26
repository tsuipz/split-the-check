import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '../../libs/hooks';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { SplitChoices } from '../../types/enums';
import { PersonCost } from '../../types/interfaces';
import TaxForReceipt from '../../components/TaxOptions/TaxForReceipt';
import PreviousButton from '../../shared/PreviousButton/PreviousButton';
import { CheckActions } from '../../libs/store';

interface PersonsCostStack {
	name: string;
	cost: number;
	type: SplitChoices.Split | SplitChoices.Persons;
}

const personsCostStackInit: PersonsCostStack[] = [];
const undoStackInit: PersonsCostStack[] = [];
const redoStackInit: PersonsCostStack[] = [];
const perPersonCostHashTableInit: { [key: string]: PersonCost } = {};
const personsCostInit: PersonCost[] = [];

const SplitWithPerson = () => {
	const dispatch = useAppDispatch();
	const [persons, setPersons] = useState('');
	const [personsSelect, setPersonsSelect] = useState([] as string[]);
	const [currentPersonsSelect, setCurrentPersonsSelect] = useState('split');
	const [cost, setCost] = useState(0);
	const [personsCostStack, setPersonsCostStack] = useState(personsCostStackInit);
	const [undoStack, setUndoStack] = useState(undoStackInit);
	const [redoStack, setRedoStack] = useState(redoStackInit);
	const [perPersonCost, setPerPersonCost] = useState(perPersonCostHashTableInit);
	const [personsCost, setPersonsCost] = useState(personsCostInit);
	const navigation = useNavigate();

	const handleAddPersons = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = event.target.value || '';
		setPersons(value);
		setPersonsSelect(value.split(','));
	};

	const handleSelectChange = (event: SelectChangeEvent<string>) => {
		const value: string = event.target.value as string;
		setCurrentPersonsSelect(value);
	};

	const handleCostChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = +event.target.value || 0;
		setCost(value);
	};

	const handleAddCostClick = () => {
		const personCostStack: PersonsCostStack = {
			name: currentPersonsSelect,
			cost: cost,
			type: currentPersonsSelect === 'split' ? SplitChoices.Split : SplitChoices.Persons,
		};
		const currentPersonsCostStack = [...personsCostStack];
		currentPersonsCostStack.push(personCostStack);
		setPersonsCostStack(currentPersonsCostStack);
		setUndoStack([]);
		setCost(0);
	};

	const handleUndo = () => {
		const currentPersonsCostStack = [...personsCostStack];
		const currentUndoStack = [...undoStack];
		const item: PersonsCostStack = currentPersonsCostStack.pop() as PersonsCostStack;
		currentUndoStack.push(item);

		setPersonsCostStack(currentPersonsCostStack);
		setUndoStack(currentUndoStack);
	};

	const handleRedo = () => {
		const currentPersonsCostStack = [...personsCostStack];
		const currentUndoStack = [...undoStack];
		const item: PersonsCostStack = currentUndoStack.pop() as PersonsCostStack;
		currentPersonsCostStack.push(item);

		setPersonsCostStack(currentPersonsCostStack);
		setUndoStack(currentUndoStack);
	};

	const handleFormSubmit = () => {
		dispatch(CheckActions.setPersonsCost(personsCost));
		dispatch(CheckActions.setSubTotal(personsCost.reduce((a, b) => a + b.cost, 0)));
		navigation('/receipt');
	};

	useEffect(() => {
		const perPersonCostHashTable: { [key: string]: PersonCost } = {};
		personsSelect.map((person) => {
			perPersonCostHashTable[person] = {
				name: person,
				cost: 0,
			};
			return person;
		});
		const personsSelectLength = personsSelect.length;
		personsCostStack.map((personCost) => {
			const { name, cost, type } = personCost;

			if (type === SplitChoices.Split) {
				const splitCost = cost / personsSelectLength;
				for (const key in perPersonCostHashTable) {
					perPersonCostHashTable[key].cost += splitCost;
				}
			} else {
				perPersonCostHashTable[name].cost += cost;
			}
		});

		setPerPersonCost(perPersonCostHashTable);
	}, [personsCostStack, personsSelect]);

	useEffect(() => {
		const persons: PersonCost[] = [];
		for (const key in perPersonCost) {
			const person = perPersonCost[key];
			persons.push(person);
		}

		setPersonsCost(persons);
	}, [perPersonCost]);

	return (
		<main>
			<form onSubmit={handleFormSubmit}>
				<h2>Split all Persons with ,</h2>
				<TextField label='Person' value={persons} onChange={handleAddPersons} />

				<FormControl fullWidth>
					<InputLabel id='demo-simple-select-label'>Split</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={currentPersonsSelect}
						label='Age'
						onChange={handleSelectChange}>
						<MenuItem value='split'>Split</MenuItem>
						{personsSelect.map((person, index) => (
							<MenuItem key={index} value={person}>
								{person}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<section>
					<TextField label='Cost' value={cost} type='number' onChange={handleCostChange} />
					<Button variant='contained' onClick={handleAddCostClick}>
						Add Cost
					</Button>
				</section>

				<TaxForReceipt />

				<section>
					{personsCost.map((person, index) => (
						<p key={index}>
							{person.name}: {person.cost}
						</p>
					))}
				</section>

				<div>
					<Button variant='contained' disabled={personsCostStack.length === 0} onClick={handleUndo}>
						Undo
					</Button>
					<Button variant='contained' disabled={undoStack.length === 0} onClick={handleRedo}>
						Redo
					</Button>
				</div>

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

export default SplitWithPerson;
