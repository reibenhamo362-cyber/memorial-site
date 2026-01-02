import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-gray-700"
            >
              אתר הנצחה
            </Link>
            <Link
              href="/about"
              className="text-gray-900 font-medium"
            >
              אודות
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              אודות הפרויקט
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-700 leading-8 text-lg">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                הרעיון
              </h2>
              <p>
                אתר הנצחה זה נוצר כדי לכבד את זכרם של החיילים שנפלו במערכות ישראל.
                כל יום בלוח השנה מוקדש לחייל אחד, לפי יום ההולדת שלו.
              </p>
              <p>
                המטרה היא להזכיר לנו כל יום את האנשים האמיצים שגיבו את חייהם למען המדינה,
                ולאפשר לנו להכיר את הסיפורים האישיים שלהם מעבר לשם ולנתונים היבשים.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                איך זה עובד
              </h2>
              <p>
                בכל יום, האתר מציג חייל אחד שתאריך יום ההולדת שלו חל באותו תאריך.
                לכל חייל מוצגים:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>שמו המלא</li>
                <li>סיפור אישי קצר על חייו</li>
                <li>ציטוט משמעותי</li>
                <li>הצעה למעשה טוב שניתן לעשות לזכרו</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                המטרה
              </h2>
              <p>
                הפרויקט נועד להפוך את ההנצחה לדבר יומיומי ומשמעותי.
                במקום טקסים שנתיים בלבד, אנחנו מזמינים אתכם להתייחד עם זכרם של הנופלים
                בכל יום, להכיר את סיפוריהם, ולבצע מעשה טוב קטן לזכרם.
              </p>
              <p>
                כך, אנחנו מבטיחים שהם לא ישכחו ושהמסר שלהם ימשיך לחיות ולהשפיע
                על הדורות הבאים.
              </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                לזכרם
              </h2>
              <p className="text-gray-600 italic">
                "הם לא מתו לשווא. הם חיים בליבנו ובזכרונותינו,
                והמעשים הטובים שאנחנו עושים לזכרם הם הדרך שלנו להמשיך את דרכם."
              </p>
            </section>
          </div>

          {/* Back to Home */}
          <div className="pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              ← חזרה לדף הבית
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

