export declare class StorageService {
    private tempDir;
    constructor();
    cleanupTempFiles(): Promise<void>;
}
export declare class MonitoringService {
    private storage;
    constructor();
    startMonitoring(): Promise<void>;
}
