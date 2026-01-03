'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AddMemoryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const soldierSlug = searchParams.get('soldier')

  const [formData, setFormData] = useState({
    soldier_slug: soldierSlug || '',
    author_name: '',
    text: '',
    image: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [soldiers, setSoldiers] = useState([])
  const [soldierId, setSoldierId] = useState(null)

  // Fetch soldiers list or specific soldier
  useEffect(() => {
    if (!soldierSlug) {
      fetch('/api/soldiers')
        .then(res => res.json())
        .then(data => {
          setSoldiers(data.soldiers || [])
        })
        .catch(err => console.error('Error fetching soldiers:', err))
    } else {
      // Fetch specific soldier by slug
      fetch(`/api/soldiers/${soldierSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.soldier) {
            setSoldierId(data.soldier.id)
            setFormData(prev => ({ ...prev, soldier_slug: soldierSlug }))
          }
        })
        .catch(err => console.error('Error fetching soldier:', err))
    }
  }, [soldierSlug])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('גודל הקובץ לא יכול לעלות על 5MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('יש להעלות קובץ תמונה בלבד')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setError('')
    }
  }

  const handleSoldierChange = (e) => {
    const selectedSoldier = soldiers.find(s => s.slug === e.target.value)
    if (selectedSoldier) {
      setSoldierId(selectedSoldier.id)
      setFormData(prev => ({ ...prev, soldier_slug: e.target.value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!soldierId || !formData.author_name.trim() || !formData.text.trim()) {
      setError('אנא מלא את כל השדות הנדרשים')
      return
    }

    setLoading(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append('soldier_id', soldierId)
      submitFormData.append('author_name', formData.author_name.trim())
      submitFormData.append('text', formData.text.trim())
      if (formData.image) {
        submitFormData.append('image', formData.image)
      }

      const response = await fetch('/api/memories', {
        method: 'POST',
        body: submitFormData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת הזיכרון')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        soldier_slug: '',
        author_name: '',
        text: '',
        image: null
      })
      setSoldierId(null)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/soldiers/${formData.soldier_slug}`)
      }, 3000)
    } catch (err) {
      setError(err.message || 'שגיאה בשליחת הזיכרון')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700"
            >
              אתר הנצחה
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/add-memory"
                className="text-gray-900 font-medium"
              >
                הוסף זיכרון
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                אודות
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          הוסף זיכרון
        </h1>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8">
            <p className="font-semibold mb-2">הזיכרון נשלח בהצלחה!</p>
            <p>הזיכרון ממתין לאישור מנהל האתר ויוצג לאחר אישורו.</p>
            <p className="mt-2 text-sm">מעביר אותך לדף החייל בעוד כמה שניות...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-8">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Soldier Selection */}
            <div>
              <label htmlFor="soldier_slug" className="block text-sm font-medium text-gray-700 mb-2">
                בחירת חייל *
              </label>
              {soldierSlug ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    זיכרון עבור חייל ספציפי (נבחר מדף הפרופיל)
                  </p>
                  {soldierId && (
                    <Link
                      href={`/soldiers/${soldierSlug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      צפה בפרופיל החייל →
                    </Link>
                  )}
                </div>
              ) : (
                <select
                  id="soldier_slug"
                  name="soldier_slug"
                  value={formData.soldier_slug}
                  onChange={handleSoldierChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">בחר חייל</option>
                  {soldiers.map(soldier => (
                    <option key={soldier.id} value={soldier.slug}>
                      {soldier.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Author Name */}
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-2">
                שם הכותב *
              </label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="הכנס את שמך"
              />
            </div>

            {/* Memory Text */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                הזיכרון *
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="שתף זיכרון, סיפור, או מחשבה..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                תמונה (אופציונלי)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.image && (
                <p className="mt-2 text-sm text-gray-600">
                  קובץ נבחר: {formData.image.name}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                מקסימום 5MB. פורמטים נתמכים: JPG, PNG, GIF
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'שולח...' : 'שלח זיכרון'}
              </button>
              <Link
                href={soldierSlug ? `/soldiers/${soldierSlug}` : '/'}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ביטול
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900 text-sm">
            <strong>שים לב:</strong> הזיכרון שתשלח יעבור בדיקה על ידי מנהל האתר לפני שיוצג בפומבי.
            אנו שומרים על כבודם של הנופלים ומבטיחים שהתוכן המתפרסם הולם ומכובד.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function AddMemoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <p className="text-gray-600">טוען...</p>
      </div>
    }>
      <AddMemoryForm />
    </Suspense>
  )
}

