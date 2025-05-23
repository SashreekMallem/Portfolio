import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all projects to calculate stats
    const { data: projects, error } = await supabase
      .from('projects')
      .select('status');

    if (error) {
      throw error;
    }

    // Calculate stats
    const totalCount = projects.length;
    const liveCount = projects.filter(p => p.status === 'live').length;
    const mvpCount = projects.filter(p => p.status === 'mvp').length;

    // Format the stats string
    const statsString = `${totalCount} Projects • ${mvpCount} MVPs • ${liveCount} Live Products`;

    return NextResponse.json({
      statsString,
      stats: {
        total: totalCount,
        mvp: mvpCount,
        live: liveCount
      }
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project stats' },
      { status: 500 }
    );
  }
}
