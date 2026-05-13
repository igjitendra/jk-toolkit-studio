// ============================================================
// JK Toolkit Studio — Server-side Background Removal API
// Uses remove.bg API (optional, needs API key)
// Falls back to client-side if key not set
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'REMOVE_BG_API_KEY not configured. Use client-side mode.' },
      { status: 501 }
    );
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const rbFormData = new FormData();
    rbFormData.append('image_file', imageFile);
    rbFormData.append('size', 'auto');
    rbFormData.append('type', 'person');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: rbFormData,
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.errors?.[0]?.title ?? 'remove.bg error' }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
