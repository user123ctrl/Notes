import Link from "next/link";
import { Sparkles, Shield, Zap, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">ملاحظاتي الذكية</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            دون أفكارك بذكاء
            <span className="text-blue-600"> مع مساعد AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            تطبيق ملاحظات ذكي يستخدم Gemini AI لمساعدتك في تنظيم أفكارك، 
            تلخيص النصوص، واقتراح أفكار جديدة - كل ذلك باللغة العربية
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ مجاناً
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Brain className="w-6 h-6 text-blue-600" />}
            title="ذكاء اصطناعي متقدم"
            description="تلخيص تلقائي للملاحظات واقتراح أفكار ذكية باستخدام Gemini"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-green-600" />}
            title="أمان وحماية"
            description="حماية كاملة لبياناتك مع مصادقة Firebase الآمنة"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            title="سريع وفعال"
            description="مزامنة فورية عبر الأجهزة مع واجهة سهلة الاستخدام"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
