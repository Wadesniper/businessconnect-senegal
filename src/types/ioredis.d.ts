declare module 'ioredis' {
  export default class Redis {
    constructor(options?: {
      port?: number;
      host?: string;
      password?: string;
      db?: number;
    });

    set(key: string, value: string): Promise<string>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    connect(): Promise<void>;
    disconnect(): void;
  }
} 