import { NextResponse } from 'next/server';
import { supabase, formatCollaborateLookingFor } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collaborate_looking_for')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching looking for data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data.map(formatCollaborateLookingFor));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const itemData = await request.json();
    
    const { data, error } = await supabase
      .from('collaborate_looking_for')
      .insert([{
        title: itemData.title,
        icon_svg: itemData.icon_svg || null,
        description: itemData.description,
        color_theme: itemData.color_theme || 'neon-cyan',
        sort_order: itemData.sort_order || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating looking for item:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateLookingFor(data));
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    const { data, error } = await supabase
      .from('collaborate_looking_for')
      .update({
        title: updateData.title,
        icon_svg: updateData.icon_svg,
        description: updateData.description,
        color_theme: updateData.color_theme,
        is_active: updateData.is_active,
        sort_order: updateData.sort_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating looking for item:', error);
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateLookingFor(data));
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('collaborate_looking_for')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting looking for item:', error);
      return NextResponse.json(
        { error: 'Failed to delete item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
