export declare class PdfService {
    private tempDir;
    constructor();
    private ensureTempDirExists;
    generatePdf(html: string, options?: {}): Promise<Buffer>;
    savePdfToFile(pdfBuffer: Buffer, filename: string): Promise<string>;
    deletePdf(filename: string): Promise<void>;
}
