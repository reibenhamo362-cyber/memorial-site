'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('add-soldier') // 'add-soldier' or 'add-memory'
  const [soldiers, setSoldiers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Add Soldier Form
  const [soldierForm, setSoldierForm] = useState({
    name: '',
    slug: '',
    date_of_death: '',
    story: '',
    profile_image: null,
    gallery_images: []
  })

  // Add Memory Form
  const [memoryForm, setMemoryForm] = useState({
    soldier_id: '',
    author_name: '',
    text: '',
    image: null
  })

  // Fetch soldiers list
  useEffect(() => {
    fetchSoldiers()
  }, [])

  const fetchSoldiers = async () => {
    try {
      const res = await fetch('/api/admin/soldiers')
      const data = await res.json()
      if (data.soldiers) {
        setSoldiers(data.soldiers)
      }
    } catch (err) {
      console.error('Error fetching soldiers:', err)
    }
  }

  const generateSlug = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0590-\u05FF\w-]/g, '')
  }

  const handleSoldierInputChange = (e) => {
    const { name, value } = e.target
    setSoldierForm(prev => {
      const updated = { ...prev, [name]: value }
      // Auto-generate slug from name
      if (name === 'name' && !prev.slug) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
    setError('')
    setSuccess('')
  }

  const handleSoldierFileChange = (e, type) => {
    if (type === 'profile') {
      setSoldierForm(prev => ({ ...prev, profile_image: e.target.files[0] || null }))
    } else if (type === 'gallery') {
      setSoldierForm(prev => ({ ...prev, gallery_images: Array.from(e.target.files) }))
    }
    setError('')
  }

  const handleMemoryInputChange = (e) => {
    const { name, value } = e.target
    setMemoryForm(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleMemoryFileChange = (e) => {
    setMemoryForm(prev => ({ ...prev, image: e.target.files[0] || null }))
    setError('')
  }

  const handleAddSoldier = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!soldierForm.name || !soldierForm.slug || !soldierForm.date_of_death) {
      setError('אנא מלא את כל השדות החובה')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', soldierForm.name.trim())
      formData.append('slug', soldierForm.slug.trim())
      formData.append('date_of_death', soldierForm.date_of_death)
      if (soldierForm.story) {
        formData.append('story', soldierForm.story.trim())
      }
      if (soldierForm.profile_image) {
        formData.append('profile_image', soldierForm.profile_image)
      }
      soldierForm.gallery_images.forEach((img) => {
        formData.append('gallery_images', img)
      })

      const response = await fetch('/api/admin/soldiers', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהוספת החייל')
      }

      setSuccess('החייל נוסף בהצלחה!')
      setSoldierForm({
        name: '',
        slug: '',
        date_of_death: '',
        story: '',
        profile_image: null,
        gallery_images: []
      })
      fetchSoldiers()
    } catch (err) {
      setError(err.message || 'שגיאה בהוספת החייל')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMemory = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!memoryForm.soldier_id || !memoryForm.author_name || !memoryForm.text) {
      setError('אנא מלא את כל השדות החובה')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('soldier_id', memoryForm.soldier_id)
      formData.append('author_name', memoryForm.author_name.trim())
      formData.append('text', memoryForm.text.trim())
      if (memoryForm.image) {
        formData.append('image', memoryForm.image)
      }

      const response = await fetch('/api/admin/memories', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהוספת הזיכרון')
      }

      setSuccess('הזיכרון נוסף בהצלחה!')
      setMemoryForm({
        soldier_id: '',
        author_name: '',
        text: '',
        image: null
      })
    } catch (err) {
      setError(err.message || 'שגיאה בהוספת הזיכרון')
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
              אתר הנצחה - ממשק ניהול
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                חזרה לאתר
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          ממשק ניהול
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('add-soldier')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'add-soldier'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            הוספת חייל חדש
          </button>
          <button
            onClick={() => setActiveTab('add-memory')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'add-memory'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            הוספת זיכרון
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        {/* Add Soldier Form */}
        {activeTab === 'add-soldier' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              הוספת חייל חדש
            </h2>
            <form onSubmit={handleAddSoldier} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={soldierForm.name}
                  onChange={handleSoldierInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="לדוגמה: דוד כהן"
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  מזהה (Slug) * - ייווצר אוטומטית
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={soldierForm.slug}
                  onChange={handleSoldierInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="לדוגמה: david-cohen"
                />
                <p className="mt-1 text-sm text-gray-500">
                  מזהה ייחודי לקישור (אנגלית בלבד, עם מקפים)
                </p>
              </div>

              {/* Date of Death */}
              <div>
                <label htmlFor="date_of_death" className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך נפילה *
                </label>
                <input
                  type="date"
                  id="date_of_death"
                  name="date_of_death"
                  value={soldierForm.date_of_death}
                  onChange={handleSoldierInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Story */}
              <div>
                <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
                  סיפור חייו
                </label>
                <textarea
                  id="story"
                  name="story"
                  value={soldierForm.story}
                  onChange={handleSoldierInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="סיפור חייו של החייל..."
                />
              </div>

              {/* Profile Image */}
              <div>
                <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-2">
                  תמונת פרופיל
                </label>
                <input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  accept="image/*"
                  onChange={(e) => handleSoldierFileChange(e, 'profile')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {soldierForm.profile_image && (
                  <p className="mt-2 text-sm text-gray-600">
                    קובץ נבחר: {soldierForm.profile_image.name}
                  </p>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700 mb-2">
                  תמונות גלריה (ניתן לבחור מספר קבצים)
                </label>
                <input
                  type="file"
                  id="gallery_images"
                  name="gallery_images"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleSoldierFileChange(e, 'gallery')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {soldierForm.gallery_images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    נבחרו {soldierForm.gallery_images.length} קבצים
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'שומר...' : 'הוסף חייל'}
              </button>
            </form>
          </div>
        )}

        {/* Add Memory Form */}
        {activeTab === 'add-memory' && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              הוספת זיכרון לחייל
            </h2>
            <form onSubmit={handleAddMemory} className="space-y-6">
              {/* Soldier Selection */}
              <div>
                <label htmlFor="soldier_id" className="block text-sm font-medium text-gray-700 mb-2">
                  בחירת חייל *
                </label>
                <select
                  id="soldier_id"
                  name="soldier_id"
                  value={memoryForm.soldier_id}
                  onChange={handleMemoryInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">בחר חייל</option>
                  {soldiers.map(soldier => (
                    <option key={soldier.id} value={soldier.id}>
                      {soldier.name}
                    </option>
                  ))}
                </select>
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
                  value={memoryForm.author_name}
                  onChange={handleMemoryInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="הכנס את שם הכותב"
                />
              </div>

              {/* Memory Text */}
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן הזיכרון *
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={memoryForm.text}
                  onChange={handleMemoryInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="כתוב את הזיכרון, המעשה הטוב, או הסיפור..."
                />
              </div>

              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  תמונה (אופציונלי)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleMemoryFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {memoryForm.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    קובץ נבחר: {memoryForm.image.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'שומר...' : 'הוסף זיכרון'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

