import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CostSymbols, SplitChoices, TaxOptions } from '../types/enums';
import { ChangePersonCost, PersonCost } from '../types/interfaces';

const personsCost: PersonCost[] = [{
	name: '',
	cost: 0,
}]

const initialState = {
	choice: SplitChoices.Split,
	splitAmount: 1,
	subTotal: 0,
	taxCost: 8.875,
	taxSymbol: CostSymbols.Percent,
	tipCost: 0,
	tipSymbol: CostSymbols.Percent,
	taxOptions: TaxOptions.PreTax,
	personsCost: personsCost
};

const checkSlice = createSlice({
	name: 'check',
	initialState,
	reducers: {
		setInitialState: (state) => {
			state = initialState;
		},
		setChoice: (state, action: PayloadAction<SplitChoices>) => {
			state.choice = action.payload;
		},
		setSplitAmount: (state, action: PayloadAction<number>) => {
			state.splitAmount = action.payload;
		},
		setTaxCost: (state, action: PayloadAction<number>) => {
			state.taxCost = action.payload;
		},
		setTaxSymbol: (state, action: PayloadAction<CostSymbols>) => {
			state.taxSymbol = action.payload;
		},
		setTaxOptions: (state, action: PayloadAction<TaxOptions>) => {
			state.taxOptions = action.payload;
		},
		setSubTotal: (state, action: PayloadAction<number>) => {
			state.subTotal = action.payload;
		},
		setTipCost: (state, action: PayloadAction<number>) => {
			state.tipCost = action.payload;
		},
		setTipSymbol: (state, action: PayloadAction<CostSymbols>) => {
			state.tipSymbol = action.payload;
		},
		setPersonsCost: (state, action: PayloadAction<PersonCost[]>) => {
			state.personsCost = action.payload
		}
	},
});

export const store = configureStore({
	reducer: {
		checks: checkSlice.reducer,
	},
});

export const CheckActions = checkSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
