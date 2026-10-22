/**
 * IELTS Official Band Score Calculation and Conversion Utilities
 */

export function calculateListeningBandScore(rawScore: number): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 6) return 3.0;
  if (score >= 4) return 2.5;
  if (score >= 2) return 2.0;
  if (score >= 1) return 1.0;
  return 0.0;
}

export function calculateReadingBandScore(rawScore: number): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 33) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 27) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 19) return 5.5;
  if (score >= 15) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 6) return 3.0;
  if (score >= 4) return 2.5;
  if (score >= 2) return 2.0;
  if (score >= 1) return 1.0;
  return 0.0;
}

/**
 * Calculates the overall IELTS band score following the official IELTS rounding rule:
 * - If average ends in .125, it rounds down to .0 (e.g. 6.125 -> 6.0)
 * - If average ends in .25, it rounds up to .5 (e.g. 6.25 -> 6.5)
 * - If average ends in .375, it rounds up to .5 (e.g. 6.375 -> 6.5)
 * - If average ends in .625, it rounds down to .5 (e.g. 6.625 -> 6.5)
 * - If average ends in .75, it rounds up to next whole band (e.g. 6.75 -> 7.0)
 * - If average ends in .875, it rounds up to next whole band (e.g. 6.875 -> 7.0)
 */
export function calculateOverallBandScore(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const whole = Math.floor(avg);
  const frac = avg - whole;

  // Round to nearest 0.5 with IELTS tie-breaking rules
  if (frac < 0.25) {
    return whole;
  } else if (frac < 0.75) {
    return whole + 0.5;
  } else {
    return whole + 1.0;
  }
}

export function getCEFRLevel(band: number): string {
  if (band >= 8.5) return 'C2 (Mastery)';
  if (band >= 7.0) return 'C1 (Effective Operational Proficiency)';
  if (band >= 5.5) return 'B2 (Vantage)';
  if (band >= 4.0) return 'B1 (Threshold)';
  return 'A2 / A1 (Basic)';
}

export function getBandDescriptor(band: number): string {
  if (band >= 9.0) return 'Expert User - Fully operational command of the language';
  if (band >= 8.0) return 'Very Good User - Fully operational command with only occasional unsystematic inaccuracies';
  if (band >= 7.0) return 'Good User - Operational command, though with occasional inaccuracies and misunderstandings';
  if (band >= 6.0) return 'Competent User - Generally effective command despite some inaccuracies';
  if (band >= 5.0) return 'Modest User - Partial command, copes with overall meaning in most situations';
  return 'Limited User - Basic competence is limited to familiar situations';
}
