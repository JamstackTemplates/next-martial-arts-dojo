// One-off and recurring fees, in whole US dollars. Monthly programme prices live in content/programs.ts.
export interface Fees {
  /** The first class. 0 shows as "Free". */
  trialClass: number;
  /** One-off joining fee. 0 shows as "None". */
  registration: number;
  /** White gi with a white belt; not needed for the trial class. */
  uniform: number;
  /** Each colour-belt grading. */
  colourGrading: number;
  /** The black belt (shodan) grading. */
  blackBeltGrading: number;
  /** Taken off the monthly fee for each additional member of the same family. */
  familyDiscountPerMonth: number;
}

export const fees: Fees = {
  trialClass: 0,
  registration: 0,
  uniform: 45,
  colourGrading: 35,
  blackBeltGrading: 120,
  familyDiscountPerMonth: 20,
};

export function dollars(amount: number, zero = 'Free'): string {
  return amount === 0 ? zero : `$${amount}`;
}
