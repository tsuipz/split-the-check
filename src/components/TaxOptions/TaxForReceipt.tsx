import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material';
import { CostSymbols, TaxOptions } from '../../types/enums';
import { useAppDispatch, useAppSelector } from '../../libs/hooks';
import { ChangeEvent } from 'react';
import { CheckActions } from '../../libs/store';

const TaxForReceipt = () => {
	const tipCost = useAppSelector((state) => state.checks.tipCost);
	const tipSymbol = useAppSelector((state) => state.checks.tipSymbol);
	const taxCost = useAppSelector((state) => state.checks.taxCost);
	const taxSymbol = useAppSelector((state) => state.checks.taxSymbol);
	const taxOptions = useAppSelector((state) => state.checks.taxOptions);
	const dispatch = useAppDispatch();

	const handleTipCost = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = +event.target.value ?? 0;
		dispatch(CheckActions.setTipCost(value));
	};

	const handleTaxCost = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = +event.target.value ?? 0;
		dispatch(CheckActions.setTaxCost(value));
	};

	const handleTipSymbol = (event: SelectChangeEvent<CostSymbols>) => {
		const value: CostSymbols = event.target.value as CostSymbols;
		dispatch(CheckActions.setTipSymbol(value));
	};

	const handleTaxSymbol = (event: SelectChangeEvent<CostSymbols>) => {
		const value: CostSymbols = event.target.value as CostSymbols;
		dispatch(CheckActions.setTaxSymbol(value));
	};

	const handleTaxOptions = (event: ChangeEvent<HTMLInputElement>) => {
		const value: TaxOptions = event.target.value as TaxOptions;
		dispatch(CheckActions.setTaxOptions(value));
	};

	return (
		<section>
			<h3>Optional</h3>
			<TextField label='Tip' type='number' value={tipCost} onChange={handleTipCost} />

			<FormControl>
				<Select value={tipSymbol} onChange={handleTipSymbol}>
					<MenuItem value={CostSymbols.Percent}>%</MenuItem>
					<MenuItem value={CostSymbols.Currency}>$</MenuItem>
				</Select>
			</FormControl>

			<TextField label='Tax' type='number' value={taxCost} onChange={handleTaxCost} />
			<FormControl>
				<Select value={taxSymbol} onChange={handleTaxSymbol}>
					<MenuItem value={CostSymbols.Percent}>%</MenuItem>
					<MenuItem value={CostSymbols.Currency}>$</MenuItem>
				</Select>
			</FormControl>
			<section>
				<FormControl>
					<FormLabel>Gender</FormLabel>
					<RadioGroup row name='row-radio-buttons-group' value={taxOptions} onChange={handleTaxOptions}>
						<FormControlLabel value={TaxOptions.PreTax} control={<Radio />} label='Tip on Pre-Tax' />
						<FormControlLabel value={TaxOptions.PostTax} control={<Radio />} label='Tip on Post-Tax' />
					</RadioGroup>
				</FormControl>
			</section>
		</section>
	);
};

export default TaxForReceipt;
