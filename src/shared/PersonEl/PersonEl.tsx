import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../libs/hooks';
import { PersonCost } from '../../types/interfaces';
import { CostSymbols, TaxOptions } from '../../types/enums';

const PersonEl = (props: PersonCost) => {
	const { name, cost: subTotal } = props;
	const totalSubTotal = useAppSelector((state) => state.checks.subTotal);
	const personsCost = useAppSelector((state) => state.checks.personsCost);
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
			const currentTax = taxSymbol === CostSymbols.Currency ? taxCost : subTotal * (taxCost / 100);
			setTaxCalc(currentTax);
		};

		const handleTipCalc = () => {
			if (tipSymbol === CostSymbols.Percent) {
				switch (taxOptions) {
					case TaxOptions.PreTax:
						{
							const tip = subTotal * (tipCost / 100);
							setTipCalc(tip);
						}
						break;
					case TaxOptions.PostTax:
						{
							const tip = (subTotal + taxCalc) * (tipCost / 100);
							setTipCalc(tip);
						}
						break;
					default:
						break;
				}
			} else {
				setTipCalc((subTotal + taxCalc) / totalSubTotal);
			}
			setTotal(subTotal + taxCalc + tipCalc);
		};

		handleTaxCalc();

		handleTipCalc();
	}, [taxCost, taxOptions, subTotal, taxSymbol, tipSymbol, total, tipCost, taxCalc, tipCalc, personsCost, totalSubTotal]);

	return (
		<section>
			<h4>Name: {name}</h4>
			<p>Sub Total: {subTotal}</p>
			<p>Tax: {taxCalc}</p>
			<p>Tip: {tipCalc}</p>
			<p>Total: {total}</p>
		</section>
	);
};

export default PersonEl;
