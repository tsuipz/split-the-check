import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../libs/hooks';
import { CostSymbols, TaxOptions } from '../../../types/enums';

const SplitReceipt = () => {
	const splitAmount = useAppSelector((state) => state.checks.splitAmount);
	const subTotal = useAppSelector((state) => state.checks.subTotal);
	const taxCost = useAppSelector((state) => state.checks.taxCost);
	const taxSymbol = useAppSelector((state) => state.checks.taxSymbol);
	const taxOptions = useAppSelector((state) => state.checks.taxOptions);
	const tipCost = useAppSelector((state) => state.checks.tipCost);
	const tipSymbol = useAppSelector((state) => state.checks.tipSymbol);
	const [taxCalc, setTaxCalc] = useState(0);
	const [tipCalc, setTipCalc] = useState(0);
	const [total, setTotal] = useState(0);
	const [splitTotal, setSplitTotal] = useState(0);

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
				setTipCalc(tipCost);
			}
			setTotal(subTotal + taxCalc + tipCalc);
			setSplitTotal(total / splitAmount);
		};

		handleTaxCalc();

		handleTipCalc();
	}, [taxCost, taxOptions, subTotal, taxSymbol, tipSymbol, total, splitAmount, tipCost, taxCalc, tipCalc]);

	return (
		<main>
			<h4>subTotal: {subTotal}</h4>
			<h4>Tax: {taxCalc}</h4>
			<h4>
				Tip on {taxOptions}: {tipCalc}
			</h4>
			<h4>Total: {total}</h4>
			<h4>
				Split between {splitAmount} people: {splitTotal}
			</h4>
		</main>
	);
};

export default SplitReceipt;
