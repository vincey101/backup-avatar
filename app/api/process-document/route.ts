import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'pdf' or 'doc'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Get the authorization header from the request
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
        }

        // Create a new FormData instance for the external API
        const externalFormData = new FormData();
        // Use 'pdf' as the field name for PDF files when sending to humanaiapp.com
        const fieldName = type === 'pdf' ? 'pdf' : 'file';
        externalFormData.append(fieldName, file);

        // Choose the appropriate endpoint based on file type
        const endpoint = type === 'pdf'
            ? 'https://api.humanaiapp.com/api/get-pdf-content'
            : 'https://api.humanaiapp.com/api/get-docx-content';

        // Make the request to the external API with the authorization header
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
            },
            body: externalFormData,
        });

        if (!response.ok) {
            return NextResponse.json({
                error: 'File processing failed',
                status: response.status
            }, { status: response.status });
        }

        // Parse the response and ensure we're returning text content
        const result = await response.json();
        let content = '';
        if (typeof result === 'string') {
            content = result;
        } else if (result.content) {
            content = result.content;
        } else if (result.text) {
            content = result.text;
        } else if (result.data) {
            content = result.data;
        } else if (result.status === 200 && typeof result.data === 'string') {
            content = result.data;
        } else {
            throw new Error('Unexpected response format from external API');
        }

        return NextResponse.json({ content });

    } catch (error) {
        return NextResponse.json({
            error: 'Error processing file',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 