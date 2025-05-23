import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type WebsiteStats = {
  id?: string;
  project_count?: number;
  mvp_count?: number;
  live_count?: number;
  custom_stats_text?: string | null;
  use_custom_text: boolean;
  last_updated?: string;
};

export async function GET() {
  try {
    // First check if we have custom stats in the database
    const { data: statsData, error: statsError } = await supabase
      .from('homepage_stats')
      .select('*')
      .single();

    // If we have stats and they're set to use custom text
    if (statsData && statsData.use_custom_text && statsData.custom_stats_text) {
      return NextResponse.json({
        stats: statsData.custom_stats_text,
        isCustom: true,
        ...statsData
      });
    }

    // Otherwise calculate stats from actual projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('status');

    if (projectsError) {
      throw projectsError;
    }

    // Calculate stats
    const totalCount = projects.length;
    const liveCount = projects.filter(p => p.status === 'live').length;
    const mvpCount = projects.filter(p => p.status === 'mvp').length;
    const statsText = `${totalCount} Projects • ${mvpCount} MVPs • ${liveCount} Live Products`;

    // Update the stats in database if we have a record
    if (statsData?.id) {
      await supabase
        .from('homepage_stats')
        .update({
          project_count: totalCount,
          mvp_count: mvpCount,
          live_count: liveCount,
          last_updated: new Date().toISOString()
        })
        .eq('id', statsData.id);
    }

    return NextResponse.json({
      total: totalCount,
      live: liveCount,
      mvp: mvpCount,
      stats: statsText,
      isCustom: false
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project stats' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: WebsiteStats = await request.json();
    
    // Get existing stats or create new
    const { data: existingStats } = await supabase
      .from('homepage_stats')
      .select('id')
      .single();

    const statsData = {
      project_count: body.project_count,
      mvp_count: body.mvp_count,
      live_count: body.live_count,
      custom_stats_text: body.custom_stats_text,
      use_custom_text: body.use_custom_text,
      last_updated: new Date().toISOString()
    };

    let data, error;

    if (existingStats) {
      // Update existing stats
      const { data: updateData, error: updateError } = await supabase
        .from('homepage_stats')
        .update(statsData)
        .eq('id', existingStats.id)
        .select()
        .single();
      
      data = updateData;
      error = updateError;
    } else {
      // Insert new stats
      const { data: insertData, error: insertError } = await supabase
        .from('homepage_stats')
        .insert([statsData])
        .select()
        .single();
      
      data = insertData;
      error = insertError;
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating homepage stats:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage stats' },
      { status: 500 }
    );
  }
}
