export default {
  collectCoverage: true,
  coverageDirectory: './.ci/logs',
  roots: ['./assets/test'],
  testEnvironment: 'jsdom',
  verbose: true,
}

// import type {Config} from 'jest';

/* export default async (): Promise<Config> => {
  return {
    verbose: true,
  };
}; */

/* {
    "collectCoverage": true,
    "coverageDirectory": "./ci/logs",
    "rootDir": "assets/test"
} */