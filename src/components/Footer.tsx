import { Instagram, Twitter, Youtube, Music2 } from "lucide-react";

export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1200px] mx-auto px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] mb-12">
          <div>
            <span className="font-outfit text-lg font-black">
              {siteName}
            </span>
            <p className="text-sm text-muted leading-relaxed mt-4 mb-5">
              Platform top up game digital terpercaya. Proses cepat, aman,
              dan harga terbaik untuk semua gamer Indonesia.
            </p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Music2, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-5">Game</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>Mobile Legends</li>
              <li>Free Fire</li>
              <li>PUBG Mobile</li>
              <li>Valorant</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-5">Perusahaan</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>Tentang Kami</li>
              <li>Karir</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-5">Bantuan</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>FAQ</li>
              <li>Pusat Bantuan</li>
              <li>Hubungi CS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-muted">
            © {new Date().getFullYear()} {siteName}. Seluruh hak cipta
            dilindungi.
          </span>
          <div className="flex gap-4 text-xs text-muted">
            <span>Privasi</span>
            <span>Ketentuan</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
