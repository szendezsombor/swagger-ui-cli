import {isValidUrl} from './is-valid-url.util';
import {existsSync} from 'node:fs';

export async function isOpenApiSpecPlaceValidUtil(openApiSpecFilePathOrURL: string): Promise<boolean> {
  if (isValidUrl(openApiSpecFilePathOrURL)) {
    try {
      await fetch(openApiSpecFilePathOrURL);
      return true;
    } catch (_) {
      return false;
    }
  }

  return existsSync(openApiSpecFilePathOrURL);
}
