import { describe, expect, test } from 'bun:test';
import { validateRsvpPayload, validateWishPayload } from './submissions';

describe('validateRsvpPayload', () => {
  test('accepts a minimal attending RSVP', () => {
    expect(validateRsvpPayload({
      name: 'Taslia',
      attendance: 'yes',
      guests: 2,
      lang: 'id',
      turnstileToken: 'token',
    })).toEqual({
      ok: true,
      data: {
        name: 'Taslia',
        attendance: 'yes',
        guests: 2,
        lang: 'id',
        turnstileToken: 'token',
      },
    });
  });

  test('rejects empty names and missing Turnstile token', () => {
    expect(validateRsvpPayload({
      name: ' ',
      attendance: 'yes',
      turnstileToken: '',
    })).toEqual({ ok: false, error: 'Please complete the required fields.' });
  });
});

describe('validateWishPayload', () => {
  test('accepts a valid wish', () => {
    expect(validateWishPayload({
      name: 'Varian',
      message: 'Congratulations',
      lang: 'en',
      turnstileToken: 'token',
    })).toEqual({
      ok: true,
      data: {
        name: 'Varian',
        message: 'Congratulations',
        lang: 'en',
        turnstileToken: 'token',
      },
    });
  });

  test('rejects overlong messages', () => {
    expect(validateWishPayload({
      name: 'Varian',
      message: 'x'.repeat(401),
      turnstileToken: 'token',
    })).toEqual({ ok: false, error: 'Please keep the message under 400 characters.' });
  });

  test('rejects empty names and empty messages', () => {
    expect(validateWishPayload({
      name: ' ',
      message: 'Congratulations',
      turnstileToken: 'token',
    })).toEqual({ ok: false, error: 'Please complete the required fields.' });

    expect(validateWishPayload({
      name: 'Taslia',
      message: ' ',
      turnstileToken: 'token',
    })).toEqual({ ok: false, error: 'Please complete the required fields.' });
  });
});
