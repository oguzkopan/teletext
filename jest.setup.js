import '@testing-library/jest-dom'

// Mock TextEncoder/TextDecoder for Firebase
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock ReadableStream for Firebase
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {};
}

// Mock fetch for Firebase
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}
