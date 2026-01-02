# אתר הנצחה

אתר הנצחה מכובד לחיילים שנפלו, המאפשר לציבור להוסיף זיכרונות ולהנציח את זכרם.

## תכונות

- 📋 דף בית עם רשימת חיילים וחיפוש
- 👤 דף פרופיל מפורט לכל חייל
- ✍️ הוספת זיכרונות (ממתינים לאישור)
- 🖼️ העלאת תמונות ל-Supabase Storage
- 🔍 חיפוש חיילים לפי שם
- 👨‍💼 דף ניהול אדמין להוספת חיילים וזיכרונות
- 📱 עיצוב רספונסיבי ו-RTL מלא

## טכנולוגיות

- **Next.js 16** - App Router
- **React 19**
- **Tailwind CSS 4**
- **Supabase** - Database, Storage, Auth
- **Hebrew Font** - Assistant (Google Fonts)

## התקנה והגדרה

### 1. התקנת תלויות

```bash
npm install
```

### 2. הגדרת Supabase

1. צור פרויקט חדש ב-[Supabase](https://supabase.com)
2. ב-Supabase Dashboard, לך ל-SQL Editor והרץ את הקובץ `supabase-schema.sql`
3. הרץ גם את `supabase-seed-data.sql` כדי להוסיף נתוני דמו
4. לך ל-Storage ויצור bucket בשם `soldiers-images` (public read, private write)
5. לך ל-Settings > API וציין את ה-URL וה-Keys

### 3. הגדרת משתני סביבה

צור קובץ `.env.local` בשורש הפרויקט:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**חשוב:** ה-`SUPABASE_SERVICE_ROLE_KEY` רגיש - אל תשתף אותו בפומבי!

### 4. הרצת השרת

```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

## מבנה הפרויקט

```
src/
├── app/
│   ├── page.js              # דף בית - רשימת חיילים
│   ├── layout.js            # Layout ראשי
│   ├── add-memory/          # דף הוספת זיכרון
│   ├── soldiers/[slug]/     # דף פרופיל חייל
│   ├── admin/               # דף ניהול אדמין
│   └── api/                 # API routes
│       ├── soldiers/        # API לחיילים
│       ├── memories/        # API לזיכרונות
│       └── admin/           # API לניהול (admin)
├── lib/
│   └── supabase.js          # קונפיגורציה של Supabase
└── data/                    # (ישן - לא בשימוש)
```

## מסד הנתונים

### טבלאות

- **soldiers** - פרטי חיילים (שם, slug, תאריך נפילה, סיפור, תמונות)
- **memories** - זיכרונות שנשלחו (ממתינים לאישור/מאושרים/נדחו)
- **admin_users** - משתמשי אדמין (לעתיד)

### סטטוס זיכרונות

- `pending` - ממתין לאישור (ברירת מחדל)
- `approved` - מאושר ומתפרסם
- `rejected` - נדחה

## נתוני דמו

הקובץ `supabase-seed-data.sql` מכיל 12 חיילי דמו עם נתונים מלאים בעברית.

## הערות חשובות

- כל הזיכרונות נשלחים עם סטטוס `pending` וממתינים לאישור
- תמונות מועלות ל-Supabase Storage ב-bucket `soldiers-images`
- האתר תומך ב-RTL מלא ובעברית
- דף האדמין ייבנה בשלבים הבאים

## דף ניהול (Admin)

דף הניהול נמצא ב-`/admin` ומאפשר:

- **הוספת חייל חדש**: שם, slug, תאריך נפילה, סיפור, תמונת פרופיל, וגלריית תמונות
- **הוספת זיכרון**: הוספת זיכרון מאושר ישירות לחייל קיים

**הערה**: דף הניהול משתמש ב-Service Role Key לפעולות, כך שהוא נותן הרשאות מלאות. ודא שדף זה מוגן בסביבת ייצור.

## פיתוח עתידי

- [ ] מערכת אימות אדמין (כרגע דף פתוח)
- [ ] דף לניהול זיכרונות ממתינים (approve/reject)
- [ ] עריכת חיילים קיימים
- [ ] מחיקת חיילים/זיכרונות

## רישיון

פרויקט זה נבנה למטרות הנצחה וכבוד לנופלים.
