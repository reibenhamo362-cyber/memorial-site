import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// POST - Create approved memory (by admin)
export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

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

    // Verify soldier exists
    const { data: soldier, error: soldierError } = await supabaseAdmin
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
      const fileName = `memory-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `memories/${fileName}`

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

      const { data: urlData } = supabaseAdmin.storage
        .from('soldiers-images')
        .getPublicUrl(filePath)

      imageUrl = urlData.publicUrl
    }

    // Insert memory with approved status
    const { data: memory, error: insertError } = await supabaseAdmin
      .from('memories')
      .insert({
        soldier_id: soldierId,
        author_name: authorName.trim(),
        text: text.trim(),
        image_url: imageUrl,
        status: 'approved',
        reviewed_at: new Date().toISOString()
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
      message: 'הזיכרון נוסף בהצלחה',
      memory
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/memories:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

