export interface PersonCost {
  name: string,
  cost: number
}

export interface ChangePersonCost {
  index: number,
  personCost: PersonCost
}
