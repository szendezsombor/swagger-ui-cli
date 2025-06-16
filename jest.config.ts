import {createDefaultEsmPreset} from 'ts-jest';
import type {Config} from 'jest';

const tsJestTransformCfg = createDefaultEsmPreset({tsconfig: './tsconfig.spec.json'}).transform;

export default async (): Promise<Config> => {
  return {
    setupFilesAfterEnv: ['./src/test/test-setup.ts'],
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    transform: {
      ...tsJestTransformCfg,
    },
  };
};
