export default {
  collectCoverage: true,
  coverageDirectory: './.ci/logs',
  roots: ['./assets/test'],
  testEnvironment: './assets/test/custom-environment.ts',
  transformIgnorePatterns: ['/node_modules/(?!(@react-leaflet|fetch-mock|geojson-vt|react-leaflet)/)'],
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