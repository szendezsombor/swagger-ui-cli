import {MatchImageSnapshotOptions} from 'jest-image-snapshot';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MATCH_IMAGE_SNAPSHOT_OPTIONS: MatchImageSnapshotOptions;
      DIST_INDEX_JS: string;
      OPENAPI_FILE_FOLDER: string;
    }
  }
}

export {};
