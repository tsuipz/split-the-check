import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../libs/hooks';
import { CostSymbols, TaxOptions } from '../../../types/enums';
import PersonEl from '../../../shared/PersonEl/PersonEl';

const PersonsReceipt = () => {
	const personsCost = useAppSelector((state) => state.checks.personsCost);
	const totalSubTotal = useAppSelector((state) => state.checks.subTotal);
	const taxCost = useAppSelector((state) => state.checks.taxCost);
	const taxSymbol = useAppSelector((state) => state.checks.taxSymbol);
	const taxOptions = useAppSelector((state) => state.checks.taxOptions);
	const tipCost = useAppSelector((state) => state.checks.tipCost);
	const tipSymbol = useAppSelector((state) => state.checks.tipSymbol);
	const [taxCalc, setTaxCalc] = useState(0);
	const [tipCalc, setTipCalc] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const handleTaxCalc = () => {
			const currentTax = taxSymbol === CostSymbols.Currency ? taxCost : totalSubTotal * (taxCost / 100);
			setTaxCalc(currentTax);
		};

		const handleTipCalc = () => {
			if (tipSymbol === CostSymbols.Percent) {
				switch (taxOptions) {
					case TaxOptions.PreTax:
						{
							const tip = totalSubTotal * (tipCost / 100);
							setTipCalc(tip);
						}
						break;
					case TaxOptions.PostTax:
						{
							const tip = (totalSubTotal + taxCalc) * (tipCost / 100);
							setTipCalc(tip);
						}
						break;
					default:
						break;
				}
			} else {
				setTipCalc((totalSubTotal + taxCalc) / totalSubTotal);
			}
			setTotal(totalSubTotal + taxCalc + tipCalc);
		};

		handleTaxCalc();

		handleTipCalc();
	}, [taxCost, taxOptions, totalSubTotal, taxSymbol, tipSymbol, total, tipCost, taxCalc, tipCalc, personsCost]);

	return (
		<main>
			{personsCost.map((person, index) => (
				<PersonEl key={index} name={person.name} cost={person.cost} />
			))}
			<h3>Everyone together</h3>
			<section>
				<p>All Sub Total: {totalSubTotal}</p>
				<p>Total Tax: {taxCalc}</p>
				<p>Total Tip: {tipCalc}</p>
				<p>Total for All: {total}</p>
			</section>
		</main>
	);
};

export default PersonsReceipt;
