import {readFileSync} from 'fs';
import {isValidUrl} from './is-valid-url.util';

export async function resolveOpenapiSpec(openApiSpecFilePathOrURL: string): Promise<string> {
  if (isValidUrl(openApiSpecFilePathOrURL)) {
    return await fetch(openApiSpecFilePathOrURL).then(res => res.text());
  }

  return readFileSync(openApiSpecFilePathOrURL, {encoding: 'utf-8'});
}
