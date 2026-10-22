export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value: T | null,
    public readonly error: string | null,
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result(true, value, null);
  }

  static failure<T>(error: string): Result<T> {
    return new Result<T>(false, null, error);
  }
}
