import {render, RenderResult} from 'cli-testing-library';
import {Browser, launch} from 'puppeteer';
import {readFileSync} from 'fs';
import {jest} from '@jest/globals';

const SERVER_DEFAULT_PORT = 8000;
const SERVER_DEFAULT_DOMAIN = 'localhost';

describe('serve command', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await launch({
      args: ['--no-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should exit with process 1 if the user pass invalid openapi spec file', async () => {
    const {findByText} = await serveCMD('invalid-openapi.yaml');

    expect(await findByText('The OpenAPI file does not exist or the provided url is unreachable: invalid-openapi.yaml')).toBeInTheConsole();
  });

  it('should load the external url docs', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn((): Promise<Response> => {
        return Promise.resolve({
          text: () => Promise.resolve(readFileSync(process.env.OPENAPI_MOCK_SPEC_FILE, {encoding: 'utf-8'})),
        }) as Promise<Response>;
      }),
    );

    const {findByText} = await serveCMD('https://example.com');

    expect(await findByText(`Server is running on http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT}`)).toBeInTheConsole();

    await expectSwaggerUI(browser);
  });

  it(`should start a server on port http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT} by default`, async () => {
    const {findByText} = await serveCMD(process.env.OPENAPI_MOCK_SPEC_FILE);

    expect(await findByText(`Server is running on http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT}`)).toBeInTheConsole();

    await expectSwaggerUI(browser);
  });

  it('should start server on port 10304 if the port flag is set', async () => {
    const {findByText} = await serveCMD(process.env.OPENAPI_MOCK_SPEC_FILE, '--port=10304');

    expect(await findByText(`Server is running on http://${SERVER_DEFAULT_DOMAIN}:10304`)).toBeInTheConsole();
    await expectSwaggerUI(browser, SERVER_DEFAULT_DOMAIN, 10304);
  });
});

export async function expectSwaggerUI(browser: Browser, domain = SERVER_DEFAULT_DOMAIN, port = SERVER_DEFAULT_PORT): Promise<void> {
  if (!process.env['CI']) return;
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});
  await page.goto(`http://${domain}:${port}`, {waitUntil: 'networkidle0'});
  await page.waitForNetworkIdle();
  const screenshot = await page.screenshot();

  expect(screenshot).toMatchImageSnapshot(process.env.MATCH_IMAGE_SNAPSHOT_OPTIONS);

  await page.close();
}

export async function serveCMD(...args: string[]): Promise<RenderResult> {
  return await render('node', [process.env.DIST_INDEX_JS, 'serve', ...args]);
}
