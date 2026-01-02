import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">חייל לא נמצא</h1>
        <p className="text-gray-600 text-lg mb-8">
          החייל המבוקש לא נמצא במערכת
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  )
}

