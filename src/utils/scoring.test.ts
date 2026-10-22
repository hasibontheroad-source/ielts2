import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateListeningBandScore,
  calculateReadingBandScore,
  calculateOverallBandScore,
  getCEFRLevel
} from './scoring.ts';

test('calculateListeningBandScore maps raw scores to accurate IELTS bands', () => {
  assert.equal(calculateListeningBandScore(40), 9.0);
  assert.equal(calculateListeningBandScore(39), 9.0);
  assert.equal(calculateListeningBandScore(35), 8.0);
  assert.equal(calculateListeningBandScore(30), 7.0);
  assert.equal(calculateListeningBandScore(23), 6.0);
  assert.equal(calculateListeningBandScore(16), 5.0);
});

test('calculateReadingBandScore maps raw Academic scores accurately', () => {
  assert.equal(calculateReadingBandScore(39), 9.0);
  assert.equal(calculateReadingBandScore(35), 8.0);
  assert.equal(calculateReadingBandScore(30), 7.0);
  assert.equal(calculateReadingBandScore(23), 6.0);
  assert.equal(calculateReadingBandScore(15), 5.0);
});

test('calculateOverallBandScore implements official IELTS rounding rules', () => {
  // 6.5, 6.5, 6.0, 6.0 = 25.0 / 4 = 6.25 -> rounds up to 6.5
  assert.equal(calculateOverallBandScore(6.5, 6.5, 6.0, 6.0), 6.5);

  // 6.5, 6.5, 5.5, 6.0 = 24.5 / 4 = 6.125 -> rounds down to 6.0
  assert.equal(calculateOverallBandScore(6.5, 6.5, 5.5, 6.0), 6.0);

  // 6.5, 7.0, 7.0, 6.5 = 27.0 / 4 = 6.75 -> rounds up to 7.0
  assert.equal(calculateOverallBandScore(6.5, 7.0, 7.0, 6.5), 7.0);

  // 7.5, 8.0, 7.0, 7.5 = 30.0 / 4 = 7.5 -> stays 7.5
  assert.equal(calculateOverallBandScore(7.5, 8.0, 7.0, 7.5), 7.5);
});

test('getCEFRLevel returns correct CEFR mapping', () => {
  assert.equal(getCEFRLevel(8.5), 'C2 (Mastery)');
  assert.equal(getCEFRLevel(7.5), 'C1 (Effective Operational Proficiency)');
  assert.equal(getCEFRLevel(6.5), 'B2 (Vantage)');
  assert.equal(getCEFRLevel(4.5), 'B1 (Threshold)');
});
