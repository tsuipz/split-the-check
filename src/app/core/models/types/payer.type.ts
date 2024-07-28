// payer id -> payee id -> amount
export type PayerHashMap = Record<string, PayeeHashMap>;
export type PayeeHashMap = Record<string, number>;
