import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Play, CheckCircle2, ChevronDown, BarChart3, Database, FileSpreadsheet, Download, RefreshCw, Zap } from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[var(--bg)] selection:bg-[var(--blue-md)] selection:text-[var(--blue-dk)] overflow-x-hidden">
      
      {/* NAV */}
      <nav className="sticky top-0 z-[300] bg-white/95 backdrop-blur-md border-b border-[var(--border)] px-6 py-3.5 flex items-center justify-between">
        <div className="text-xl font-extrabold tracking-tight text-[var(--text)]">
          metod<em className="text-[var(--blue)] not-italic">X</em>
        </div>
        
        <ul className="hidden md:flex gap-6 list-none">
          <li><a href="#ozellikler" className="text-[0.85rem] text-[var(--text2)] font-medium hover:text-[var(--blue)] transition-colors">Özellikler</a></li>
          <li><a href="#fiyat" className="text-[0.85rem] text-[var(--text2)] font-medium hover:text-[var(--blue)] transition-colors">Fiyatlar</a></li>
          <li><a href="#sss" className="text-[0.85rem] text-[var(--text2)] font-medium hover:text-[var(--blue)] transition-colors">SSS</a></li>
        </ul>

        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 bg-[var(--blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] hover:-translate-y-[1px] transition-all">
              Dashboard'a Git →
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex items-center justify-center gap-1.5 bg-transparent text-[var(--text2)] border-[1.5px] border-[var(--border2)] px-4 py-2 rounded-xl text-[0.83rem] font-semibold hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lt)] transition-all">Giriş Yap</Link>
              <Link href="/register" className="inline-flex items-center gap-1.5 bg-[var(--blue)] text-white px-4 py-2 rounded-xl text-[0.83rem] font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] hover:-translate-y-[1px] transition-all">Ücretsiz Başla →</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-white to-[#eef3ff] border-b border-[var(--border)] px-6 pt-20 pb-16 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 bg-[var(--blue-lt)] border-[1.5px] border-[var(--blue-md)] text-[var(--blue)] text-[0.73rem] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] animate-pulse shrink-0"></span>
          Yeni Nesil Zaman Ölçümü
        </div>
        <h1 className="text-[clamp(2rem,5.5vw,3.8rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--text)] mb-4">
          Kağıt ve Kalemi<br/>Fabrikadan Emekli Edin
        </h1>
        <p className="text-[1.05rem] text-[var(--text2)] max-w-lg mx-auto mb-8 leading-relaxed">
          Metot mühendisleri için özel tasarlandı. Sahada dijital kronometre ile ölçüm yapın, ILO standardında rating belirleyin, tek tıkla Excel raporunuzu bilgisayara indirin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 w-full max-w-md mx-auto sm:max-w-none px-4">
          {session ? (
            <Link href="/dashboard" className="inline-flex justify-center items-center bg-[var(--blue)] text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] transition-all">
              Hemen Ölçüme Başla →
            </Link>
          ) : (
            <>
              <Link href="/register" className="inline-flex justify-center items-center bg-[var(--blue)] text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] transition-all">
                Ücretsiz Hesap Oluştur →
              </Link>
              <Link href="#ozellikler" className="inline-flex justify-center items-center bg-[var(--blue-lt)] text-[var(--blue)] border-[1.5px] border-[var(--blue-md)] px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-[var(--blue-md)] transition-all">
                Özellikleri İncele
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-2.5 justify-center flex-wrap px-4">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[var(--border)] rounded-full px-3.5 py-1 text-[0.77rem] text-[var(--text2)] font-medium shadow-[var(--shadow-sm)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0"></span> Kredi Kartı Gerekmez
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-[var(--border)] rounded-full px-3.5 py-1 text-[0.77rem] text-[var(--text2)] font-medium shadow-[var(--shadow-sm)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0"></span> Tablet ve Mobil Uyumlu
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-[var(--border)] rounded-full px-3.5 py-1 text-[0.77rem] text-[var(--text2)] font-medium shadow-[var(--shadow-sm)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0"></span> Endüstri Standartları
          </span>
        </div>
      </div>

      {/* FEATURES */}
      <div id="ozellikler" className="bg-[var(--bg2)] border-y border-[var(--border)] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-[0.7rem] font-bold tracking-widest uppercase text-[var(--blue)] mb-1.5">Teknoloji & Özellikler</div>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.3rem)] font-extrabold tracking-tight text-[var(--text)] leading-[1.1] mb-2">
            Fabrika Sahası Göz Önünde Bulundurularak Tasarlandı
          </h2>
          <p className="text-[var(--text2)] text-[0.92rem] leading-relaxed max-w-lg mb-10">
            Zaman etüdü süreçlerinizi otomatize edin. Yanılma payını sıfıra indiren ve raporlamayı saniyelere çeken özellikleri keşfedin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Milisaniye Hassasiyeti", desc: "Kesintisiz ölçüm veya tur moduyla en küçük hareketleri bile hatasız takip edin. Veriler anında analiz edilir.", icon: <Play size={20} className="text-[var(--blue)]" />, bg: "bg-[var(--blue-lt)]" },
              { title: "Tek Tıkla Excel Dışa Aktar", desc: "Verileri bilgisayara elinizle girmeyin. Tüm ölçümler normalleştirilip, kullanıma hazır tablo (.xlsx) formatında insin.", icon: <Download size={20} className="text-[var(--green)]" />, bg: "bg-[var(--green-lt)]" },
              { title: "Performans Rating & Normal Süre", desc: "Zaman algısını ortadan kaldırın. ILO standartlarına uygun çalışma hızı değerlendirmesi (Rating) ile 'Normal Süreyi' otomatik hesaplayın.", icon: <BarChart3 size={20} className="text-[var(--amber)]" />, bg: "bg-[var(--amber-lt)]" },
              { title: "Çoklu Hat ve Operasyon", desc: "Birden fazla projeyi ve üretim hattını tek merkezden yönetmek artık çok kolay. Müzakere edilemez standartlar oluşturun.", icon: <Database size={20} className="text-[#9333ea]" />, bg: "bg-[#fdf4ff]" },
              { title: "Tablet ve Mobil Deneyim", desc: "El alışkanlıklarınıza uygun geniş buton tasarımlarıyla telefonda, tablette hata yapmadan kullanılabilecek arayüzler.", icon: <CheckCircle2 size={20} className="text-[var(--red)]" />, bg: "bg-[var(--red-lt)]" },
              { title: "Büyük Veri & Sürekli İyileştirme", desc: "Eski verilerini karşılaştır, trend analizleri yap ve sürekli hat dengeleme için güvenilir bir veri kaynağı oluştur.", icon: <RefreshCw size={20} className="text-[var(--blue)]" />, bg: "bg-[var(--blue-lt)]" },
            ].map((f, i) => (
              <div key={i} className="bg-[var(--bg)] border-[1.5px] border-[var(--border)] rounded-[var(--r-lg)] p-6 hover:border-[var(--blue)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="text-[0.95rem] font-bold text-[var(--text)] mb-2 tracking-tight">{f.title}</h3>
                <p className="text-[0.82rem] text-[var(--text2)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="fiyat" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-[0.7rem] font-bold tracking-widest uppercase text-[var(--blue)] mb-1.5">Fiyatlandırma</div>
        <h2 className="text-[clamp(1.6rem,3.5vw,2.3rem)] font-extrabold tracking-tight text-[var(--text)] leading-[1.1] mb-2">Şeffaf ve Adil</h2>
        <p className="text-[var(--text2)] text-[0.92rem] leading-relaxed max-w-lg mb-10">Her ölçeğe uygun kullanım. Denemesi ücretsiz.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
           
           <div className="bg-[var(--bg2)] border-[1.5px] border-[var(--border)] rounded-[var(--r-lg)] p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow)] relative">
              <div className="text-[0.67rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-2.5">Başlangıç</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">₺0 <sub className="text-sm font-normal text-[var(--text2)]">/ ay</sub></div>
              <p className="text-[0.81rem] text-[var(--text2)] mb-5 min-h-[40px]">Bireysel deneme ve öğrenci/küçük projeler için.</p>
              <ul className="list-none border-t border-[var(--border)] pt-4 mb-6 space-y-3">
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> 1 Proje & Ana Hat</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Sınırsız gözlem</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Excel Dışa Aktar</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text3)] opacity-70">— Çoklu Kullanıcı</li>
              </ul>
              <Link href={session ? "/dashboard" : "/register"} className="block text-center w-full bg-transparent border-[1.5px] border-[var(--border2)] text-[var(--text2)] py-2.5 rounded-xl text-[0.87rem] font-bold hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lt)] transition-all">Şimdi Başla</Link>
           </div>

           <div className="bg-[var(--bg2)] border-[1.5px] border-[var(--blue)] rounded-[var(--r-lg)] p-7 transition-all hover:-translate-y-1 shadow-[0_0_0_4px_rgba(37,99,235,0.07)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--blue)] text-white text-[0.67rem] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full whitespace-nowrap">En Popüler</div>
              <div className="text-[0.67rem] font-bold tracking-widest uppercase text-[var(--blue)] mb-2.5">Profesyonel</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">₺490 <sub className="text-sm font-normal text-[var(--text2)]">/ ay</sub></div>
              <p className="text-[0.81rem] text-[var(--text2)] mb-5 min-h-[40px]">Aktif saha mühendisleri ve standart analiz ekipleri.</p>
              <ul className="list-none border-t border-[var(--border)] pt-4 mb-6 space-y-3">
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Sınırsız Proje</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Gelişmiş Analizler</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Excel ve CSV Çıktısı</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> 3 Kullanıcı Desteği</li>
              </ul>
              <Link href={session ? "/dashboard" : "/register"} className="block text-center w-full bg-[var(--blue)] text-white py-2.5 rounded-xl text-[0.87rem] font-bold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] transition-all">Ücretsiz Dene</Link>
           </div>

           <div className="bg-[var(--bg2)] border-[1.5px] border-[var(--border)] rounded-[var(--r-lg)] p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow)] relative">
              <div className="text-[0.67rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-2.5">Kurumsal</div>
              <div className="text-4xl font-extrabold tracking-tight text-[var(--text)] mb-2">₺1.890 <sub className="text-sm font-normal text-[var(--text2)]">/ ay</sub></div>
              <p className="text-[0.81rem] text-[var(--text2)] mb-5 min-h-[40px]">Dev fabrikalar, entegre MRP ve IT sistemleri.</p>
              <ul className="list-none border-t border-[var(--border)] pt-4 mb-6 space-y-3">
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Pro'daki Her Şey</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Sınırsız Kullanıcı</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> Active Directory / SSO</li>
                 <li className="flex gap-2 text-[0.81rem] text-[var(--text2)]"><CheckCircle2 size={16} className="text-[var(--green)] shrink-0" /> REST API Desteği</li>
              </ul>
              <Link href="#" className="block text-center w-full bg-transparent border-[1.5px] border-[var(--border2)] text-[var(--text2)] py-2.5 rounded-xl text-[0.87rem] font-bold hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lt)] transition-all">İletişime Geç →</Link>
           </div>

        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-gradient-to-br from-[var(--blue-lt)] via-white to-[var(--green-lt)] border-t border-[var(--border)] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[0.7rem] font-bold tracking-widest uppercase text-[var(--blue)] mb-3">Hemen Başlayın</div>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tight text-[var(--text)] leading-[1.1] mb-4">Bugün Daha Verimli Olun</h2>
          <p className="text-[var(--text2)] text-[0.93rem] leading-relaxed mb-8">Kurulum veya sunucu kiralama yok, kredi kartı yok. Hemen kaydolun ve dijital dönüşümünüzü saniyeler içinde başlatın.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={session ? "/dashboard" : "/register"} className="inline-flex justify-center items-center bg-[var(--blue)] text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.22)] hover:bg-[var(--blue-dk)] transition-all">
               {session ? "Dashboard'a Ortamına Geç →" : "Ücretsiz Hesap Oluştur →"}
            </Link>
             <Link href="#ozellikler" className="inline-flex justify-center items-center bg-white text-[var(--text)] border-[1.5px] border-[var(--border)] px-8 py-3.5 rounded-xl text-base font-semibold hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all">
                Daha Fazla Bilgi
             </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[var(--text)] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[1.1rem] font-extrabold tracking-tight text-white">
            metod<em className="text-[var(--blue)] not-italic">X</em>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-[0.77rem] text-white/40 hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="text-[0.77rem] text-white/40 hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="text-[0.77rem] text-white/40 hover:text-white transition-colors">KVKK</a>
            <a href="#" className="text-[0.77rem] text-white/40 hover:text-white transition-colors">Destek</a>
          </div>
          <div className="text-[0.74rem] text-white/35">
            © 2026 metodX · Tüm hakları saklıdır
          </div>
        </div>
      </footer>
    </div>
  );
}
