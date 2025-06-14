declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SNAPSHOTS_DIR: string;
      DIST_INDEX_JS: string;
      OPENAPI_FILE_FOLDER: string;
    }
  }
}

export {};
