/* eslint-disable prettier/prettier */
import { checkSystemDependencies, initializeData, initializeSchema } from '../../../src/initialization';
import { listenServer, stopServer } from '../../../src/httpServer';
import conf from '../../../src/config/conf';
import { ONE_MINUTE, FIVE_MINUTES } from '../../utils/testQuery';
import { execPython3 } from "../../../src/python/pythonBridge";

describe('Database provision', () => {
  const path = './src/python';
  const apiUri = `http://localhost:${conf.get('app:port')}`;
  const apiToken = conf.get('app:admin:token');
  const importOpts = [apiUri, apiToken, '/tests/data/DATA-TEST-STIX2_v2.json'];

  it('should dependencies accessible',  () => {
    return expect(checkSystemDependencies()).resolves.toBe(true);
  }, ONE_MINUTE);

  it('should schema initialized', () => {
    return expect(initializeSchema()).resolves.toBe(true);
  }, FIVE_MINUTES);

  it('should default data initialized', () => {
    return expect(initializeData()).resolves.toBe(true);
  }, FIVE_MINUTES);

  it('Should import creation succeed', async () => {
    const httpServer = await listenServer();
    const execution = await execPython3(path, 'local_importer.py', importOpts);
    expect(execution).not.toBeNull();
    expect(execution.status).toEqual('success');
    await stopServer(httpServer);
  }, FIVE_MINUTES);

  // Python lib is fixed but we need to wait for a new release
  it('Should import update succeed', async () => {
    const httpServer = await listenServer();
    const execution = await execPython3(path, 'local_importer.py', importOpts);
    expect(execution).not.toBeNull();
    expect(execution.status).toEqual('success');
    await stopServer(httpServer);
  }, FIVE_MINUTES);
});
