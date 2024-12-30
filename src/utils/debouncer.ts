export class Debouncer {
  private timeoutId: NodeJS.Timeout | undefined = undefined;
  private waitMs: number;

  constructor(waitMs: number) {
    this.waitMs = waitMs;
  }

  clear() {
    clearTimeout(this.timeoutId);
  }

  debounce(callback: () => void) {
    this.clear();
    this.timeoutId = setTimeout(() => {
      callback();
    }, this.waitMs);
  }
}
