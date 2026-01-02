import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET - Get all soldiers (for admin)
export async function GET(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('soldiers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching soldiers:', error)
      return NextResponse.json(
        { error: 'שגיאה בטעינת הנתונים' },
        { status: 500 }
      )
    }

    return NextResponse.json({ soldiers: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/soldiers:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

// POST - Create new soldier
export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'שירות לא זמין' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const name = formData.get('name')
    const slug = formData.get('slug')
    const dateOfDeath = formData.get('date_of_death')
    const story = formData.get('story')
    const profileImage = formData.get('profile_image')
    // Get all gallery images (FormData.getAll returns all values with same key)
    const galleryImages = formData.getAll('gallery_images').filter(item => item instanceof File)

    // Validate required fields
    if (!name || !slug || !dateOfDeath) {
      return NextResponse.json(
        { error: 'שדות חובה חסרים: שם, slug, תאריך נפילה' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('soldiers')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'קיים כבר חייל עם slug זה' },
        { status: 400 }
      )
    }

    let profileImageUrl = null

    // Upload profile image if provided
    if (profileImage && profileImage.size > 0) {
      const fileExt = profileImage.name.split('.').pop()
      const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `soldiers/${fileName}`

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('soldiers-images')
        .upload(filePath, profileImage, {
          contentType: profileImage.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading profile image:', uploadError)
        return NextResponse.json(
          { error: 'שגיאה בהעלאת תמונת הפרופיל' },
          { status: 500 }
        )
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('soldiers-images')
        .getPublicUrl(filePath)

      profileImageUrl = urlData.publicUrl
    }

    // Upload gallery images
    const galleryImageUrls = []
    for (const imageFile of galleryImages) {
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `soldiers/${fileName}`

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('soldiers-images')
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            cacheControl: '3600',
            upsert: false
          })

        if (!uploadError && uploadData) {
          const { data: urlData } = supabaseAdmin.storage
            .from('soldiers-images')
            .getPublicUrl(filePath)
          galleryImageUrls.push(urlData.publicUrl)
        }
      }
    }

    // Insert soldier
    const { data: soldier, error: insertError } = await supabaseAdmin
      .from('soldiers')
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        date_of_death: dateOfDeath,
        story: story ? story.trim() : null,
        profile_image: profileImageUrl,
        gallery_images: galleryImageUrls.length > 0 ? galleryImageUrls : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting soldier:', insertError)
      return NextResponse.json(
        { error: 'שגיאה בשמירת החייל' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'החייל נוסף בהצלחה',
      soldier
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/soldiers:', error)
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    )
  }
}

