import { CargoExecutorSchema } from './schema';
import executor from './executor';

const options: CargoExecutorSchema = {};

describe('Cargo Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});