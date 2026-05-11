export default function LandingFooter() {
  return (
    <footer className="border-t border-aura-silver/30 bg-white/40 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-aura-dark/60 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-aura-gradient text-xs font-black text-white">
            A
          </span>
          <span className="font-bold text-aura-dark">AURA AI</span>
          <span className="text-aura-silver">·</span>
          <span>© ٢٠٢٦ — مدعومة بالذكاء الاصطناعي مفتوح المصدر.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#agents" className="hover:text-aura-blue">
            الوكلاء
          </a>
          <a href="#how" className="hover:text-aura-blue">
            كيف يعمل
          </a>
          <a href="#pricing" className="hover:text-aura-blue">
            الأسعار
          </a>
        </div>
      </div>
    </footer>
  );
}
