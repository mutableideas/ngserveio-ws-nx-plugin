import { CargoExecutorSchema } from './schema';

export default async function runExecutor(
  options: CargoExecutorSchema,
) {
  console.log('Executor ran for Cargo', options)
  return {
    success: true
  }
}

