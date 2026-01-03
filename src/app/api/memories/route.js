export const dynamic = 'force-dynamic'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const soldierId = searchParams.get('soldier_id')
    const status = searchParams.get('status') || 'approved'

    let query = supabase
      .from('memories')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (soldierId) {
      query = query.eq('soldier_id', soldierId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching memories:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הנתונים' },
        { status: 500 }
      )
    }

    return NextResponse.json({ memories: data || [] })
  } catch (error) {
    console.error('Error in GET /api/memories:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const soldierId = formData.get('soldier_id')
    const authorName = formData.get('author_name')
    const text = formData.get('text')
    const imageFile = formData.get('image')

    // Validate required fields
    if (!soldierId || !authorName || !text) {
      return NextResponse.json(
        { error: 'שדות חובה חסרים' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    // Verify soldier exists
    const { data: soldier, error: soldierError } = await supabase
      .from('soldiers')
      .select('id')
      .eq('id', soldierId)
      .single()

    if (soldierError || !soldier) {
      return NextResponse.json(
        { error: 'חייל לא נמצא' },
        { status: 404 }
      )
    }

    let imageUrl = null

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `memories/${fileName}`

      // Use admin client to upload (bypasses RLS)
      if (!supabaseAdmin) {
        return NextResponse.json(
          { error: 'שירות ההעלאה לא זמין' },
          { status: 500 }
        )
      }

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('soldiers-images')
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'שגיאה בהעלאת התמונה' },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('soldiers-images')
        .getPublicUrl(filePath)

      imageUrl = urlData.publicUrl
    }

    // Insert memory with pending status
    const { data: memory, error: insertError } = await supabase
      .from('memories')
      .insert({
        soldier_id: soldierId,
        author_name: authorName,
        text: text.trim(),
        image_url: imageUrl,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting memory:', insertError)
      return NextResponse.json(
        { error: 'שגיאה בשמירת הזיכרון' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'הזיכרון נשלח בהצלחה וממתין לאישור',
      memory
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/memories:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

