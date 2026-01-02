import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase
      .from('soldiers')
      .select('*')
      .order('date_of_death', { ascending: false })

    // If search query exists, filter by name (simple text search)
    if (search && search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching soldiers:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הנתונים' },
        { status: 500 }
      )
    }

    return NextResponse.json({ soldiers: data || [] })
  } catch (error) {
    console.error('Error in GET /api/soldiers:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

