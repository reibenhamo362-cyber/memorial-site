import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getSoldierData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/soldiers/${slug}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error('Failed to fetch soldier')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching soldier:', error)
    return null
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function SoldierPage({ params }) {
  const { slug } = params
  const data = await getSoldierData(slug)

  if (!data || !data.soldier) {
    notFound()
  }

  const { soldier, memories } = data

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
                className="text-gray-600 hover:text-gray-900 transition-colors"
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
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← חזרה לרשימת החיילים
        </Link>

        {/* Soldier Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
          {/* Profile Image */}
          <div className="w-full h-96 bg-gray-200 relative">
            {soldier.profile_image ? (
              <Image
                src={soldier.profile_image}
                alt={soldier.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-9xl">
                🕯️
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {soldier.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              נפל ב-{formatDate(soldier.date_of_death)}
            </p>
            
            {/* Add Memory Button */}
            <Link
              href={`/add-memory?soldier=${slug}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              הוסף זיכרון לזכרו
            </Link>
          </div>
        </div>

        {/* Story Section */}
        {soldier.story && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              סיפור חייו
            </h2>
            <p className="text-gray-700 leading-8 text-lg whitespace-pre-line">
              {soldier.story}
            </p>
          </div>
        )}

        {/* Gallery Section */}
        {soldier.gallery_images && soldier.gallery_images.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              גלריית תמונות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soldier.gallery_images.map((imageUrl, index) => (
                <div key={index} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${soldier.name} - תמונה ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memories Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            זיכרונות ({memories?.length || 0})
          </h2>

          {memories && memories.length > 0 ? (
            <div className="space-y-6">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-gray-50 rounded-lg p-6 border-r-4 border-blue-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-gray-900">{memory.author_name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(memory.created_at)}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-7 whitespace-pre-line">
                    {memory.text}
                  </p>
                  {memory.image_url && (
                    <div className="mt-4 relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={memory.image_url}
                        alt="זיכרון"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">אין זיכרונות עדיין</p>
              <Link
                href={`/add-memory?soldier=${slug}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                הוסף את הזיכרון הראשון
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

