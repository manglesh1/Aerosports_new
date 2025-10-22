import { NextResponse } from 'next/server';
import { fetchPageData } from '@/lib/sheets';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const subcategory = searchParams.get('subcategory');

  if (!location || !subcategory) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const pageData = await fetchPageData(location, subcategory);
    return NextResponse.json(pageData);
  } catch (error) {
    console.error('Error fetching attraction details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction details' },
      { status: 500 }
    );
  }
}
