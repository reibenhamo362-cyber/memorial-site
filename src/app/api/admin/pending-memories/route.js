export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET - Get all pending memories
export async function GET(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('memories')
      .select(`
        *,
        soldiers (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending memories:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הנתונים' },
        { status: 500 }
      )
    }

    return NextResponse.json({ memories: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/pending-memories:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

// PATCH - Approve or reject memory
export async function PATCH(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const { memoryId, status } = await request.json()

    if (!memoryId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'נתונים לא תקינים' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('memories')
      .update({
        status,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', memoryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating memory:', error)
      return NextResponse.json(
        { error: 'שגיאה בעדכון הזיכרון' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: status === 'approved' ? 'הזיכרון אושר' : 'הזיכרון נדחה',
      memory: data
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/pending-memories:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

