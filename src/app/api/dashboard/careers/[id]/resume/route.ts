import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const application = await prisma.careerApplication.findUnique({
    where: { id },
    select: { resumeName: true, resumeData: true },
  });

  if (!application || !application.resumeData) {
    return NextResponse.json(
      { error: 'Resume not found for this application.' },
      { status: 404 }
    );
  }

  const url = new URL(request.url);
  const isDownload = url.searchParams.get('download') === '1';

  // Decode base64 to buffer
  const fileBuffer = Buffer.from(application.resumeData, 'base64');
  const filename = application.resumeName || 'resume.pdf';

  const dispositionType = isDownload ? 'attachment' : 'inline';
  const encodedFilename = encodeURIComponent(filename);

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${dispositionType}; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      'Content-Length': String(fileBuffer.length),
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
