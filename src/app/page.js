import Link from "next/link";
import Image from "next/image";

async function getSoldiers(searchQuery = '') {
  try {
    const url = searchQuery 
      ? `/api/soldiers?search=${encodeURIComponent(searchQuery)}`
      : '/api/soldiers'
    
    const res = await fetch(url, { cache: 'no-store' })
    
    if (!res.ok) {
      console.error('Failed to fetch soldiers')
      return []
    }
    
    const data = await res.json()
    return data.soldiers || []
  } catch (error) {
    console.error('Error fetching soldiers:', error)
    return []
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

export default async function Home({ searchParams }) {
  const searchQuery = (searchParams?.search ?? "").toString();

  // Handle searchParams in Next.js App Router
  const search = typeof searchParams?.search === 'string' ? searchParams.search : ''
  const soldiers = await getSoldiers(search)

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
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            אתר הנצחה
          </h1>
          <p className="text-gray-600 text-lg">
            נר זכרם יאיר לעד בליבנו
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <form action="/" method="get" className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue=""
                placeholder="חפש לפי שם..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Soldiers Grid */}
        {soldiers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldiers.map((soldier) => (
              <Link
                key={soldier.id}
                href={`/soldiers/${soldier.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
              >
                {/* Image */}
                <div className="w-full h-48 bg-gray-200 relative">
                  {soldier.profile_image ? (
                    <Image
                      src={soldier.profile_image}
                      alt={soldier.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      🕯️
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {soldier.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    נפל ב-{formatDate(soldier.date_of_death)}
                  </p>
                  {soldier.story && (
                    <p className="text-gray-700 line-clamp-3">
                      {soldier.story.substring(0, 150)}...
                    </p>
                  )}
                  <div className="mt-4 text-blue-600 font-medium">
                    קרא עוד →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              {searchQuery ? 'לא נמצאו חיילים התואמים לחיפוש' : 'אין חיילים להצגה'}
            </p>
            {searchQuery && (
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                הצג את כל החיילים
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
