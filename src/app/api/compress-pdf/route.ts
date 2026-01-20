import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
        }

        // Convert file to array buffer
        const arrayBuffer = await file.arrayBuffer();
        const originalSize = arrayBuffer.byteLength;

        // Load the PDF
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
        });

        // Remove metadata
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');

        // Save with aggressive compression settings
        const compressedPdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 50,
        });

        const compressedSize = compressedPdfBytes.byteLength;
        const reductionPercent = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        console.log(`PDF compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${reductionPercent}% reduction)`);

        // Convert to Buffer for NextResponse
        const buffer = Buffer.from(compressedPdfBytes);

        // Return compressed PDF
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': compressedSize.toString(),
                'X-Original-Size': originalSize.toString(),
                'X-Compressed-Size': compressedSize.toString(),
                'X-Reduction-Percent': reductionPercent,
            },
        });
    } catch (error) {
        console.error('PDF compression error:', error);
        return NextResponse.json(
            { error: 'Failed to compress PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
