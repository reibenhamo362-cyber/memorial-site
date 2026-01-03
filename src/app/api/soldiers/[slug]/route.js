export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const { slug } = params

    // Get soldier by slug
    const { data: soldier, error: soldierError } = await supabase
      .from('soldiers')
      .select('*')
      .eq('slug', slug)
      .single()

    if (soldierError || !soldier) {
      return NextResponse.json(
        { error: 'חייל לא נמצא' },
        { status: 404 }
      )
    }

    // Get approved memories for this soldier
    const { data: memories, error: memoriesError } = await supabase
      .from('memories')
      .select('*')
      .eq('soldier_id', soldier.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (memoriesError) {
      console.error('Error fetching memories:', memoriesError)
      // Continue even if memories fail to load
    }

    return NextResponse.json({
      soldier,
      memories: memories || []
    })
  } catch (error) {
    console.error('Error in GET /api/soldiers/[slug]:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

