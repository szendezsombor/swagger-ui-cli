import {render} from 'cli-testing-library';
import {launch} from 'puppeteer';

const DIST_INDEX_JS = process.env.DIST_INDEX_JS;
const OPENAPI_FILE_FOLDER = process.env.OPENAPI_FILE_FOLDER;
const SNAPSHOTS_DIR = process.env.SNAPSHOTS_DIR;
const SERVER_DEFAULT_PORT = 8000;
const SERVER_DEFAULT_DOMAIN = 'localhost';

const serveCMD = async (...args: string[]) => await render('node', [DIST_INDEX_JS, 'serve', ...args]);

describe('serve command', () => {
  it('should exit with process 1 if the user pass invalid openapi spec file', async () => {
    const {findByText} = await serveCMD('invalid-openapi.yaml');

    expect(await findByText('The OpenAPI file does not exist: invalid-openapi.yaml')).toBeInTheConsole();
  });

  it(`should start a server on port http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT} by default`, async () => {
    const {findByText} = await serveCMD(OPENAPI_FILE_FOLDER);

    expect(await findByText(`Server is running on http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT}`)).toBeInTheConsole();
    const response = await fetch(`http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT}`);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<!doctype html>');

    const browser = await launch();
    const page = await browser.newPage();
    await page.setViewport({width: 800, height: 600});
    await page.goto(`http://${SERVER_DEFAULT_DOMAIN}:${SERVER_DEFAULT_PORT}`);
    await page.waitForSelector('.title');

    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      customDiffDir: SNAPSHOTS_DIR,
      customSnapshotsDir: SNAPSHOTS_DIR,
      customReceivedDir: SNAPSHOTS_DIR,
      updatePassedSnapshot: true,
    });

    await browser.close();
  });

  it('should start server on port 10304 if the port flag is set', async () => {
    const {findByText} = await serveCMD(OPENAPI_FILE_FOLDER, '--port=10304');

    expect(await findByText(`Server is running on http://${SERVER_DEFAULT_DOMAIN}:10304`)).toBeInTheConsole();
    const response = await fetch(`http://${SERVER_DEFAULT_DOMAIN}:10304`);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<!doctype html>');
  });
});
