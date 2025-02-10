import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
        }

        const externalFormData = new FormData();
        if (type === 'pdf') {
            externalFormData.append('pdf', file);
        } else if (type === 'docx') {
            externalFormData.append('docx', file);
        }

        const endpoint = type === 'pdf'
            ? 'https://api.humanaiapp.com/api/get-pdf-content'
            : 'https://api.humanaiapp.com/api/get-docx-content';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
            },
            body: externalFormData,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json({
                error: 'File processing failed',
                status: response.status,
                details: errorData || 'Unknown error'
            }, { status: response.status });
        }

        const result = await response.json();

        // Handle DOCX specific response format
        if (type === 'docx') {
            if (result.status === 200 && result.data) {
                return NextResponse.json({ content: result.data });
            }
        }
        // Handle PDF and other formats
        else if (typeof result === 'string') {
            return NextResponse.json({ content: result });
        } else if (result.content) {
            return NextResponse.json({ content: result.content });
        } else if (result.text) {
            return NextResponse.json({ content: result.text });
        } else if (result.data) {
            return NextResponse.json({ content: result.data });
        }

        return NextResponse.json({
            error: 'Unexpected response format',
            details: 'Response format not recognized'
        }, { status: 500 });

    } catch (error) {
        return NextResponse.json({
            error: 'Error processing file',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 