import { ImageGallery } from "@/components/ui/image-gallery";
import { GALLERY_STATS } from "@/data/gallery";
import { Camera } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gallery-bg text-gallery-foreground flex flex-col selection:bg-gallery-accent-soft selection:text-gallery-foreground">
      {/* Editorial Header */}
      <header className="w-full border-b border-gallery-border bg-gallery-bg/85 backdrop-blur-md sticky top-0 z-30 transition-all duration-300">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full border border-gallery-border bg-gallery-surface flex items-center justify-center text-gallery-primary shadow-xs">
              <Camera className="size-3.5 stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-gallery-foreground m-0">
                Gabriel Gouveia
              </h1>
              <p className="text-[10px] font-sans font-light tracking-[0.25em] uppercase text-gallery-muted m-0">
                Fotografia
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-sans font-light tracking-wider text-gallery-muted">
            <span className="px-3 py-1 rounded-full border border-gallery-border bg-gallery-surface/60">
              {GALLERY_STATS.totalCount} fotografias
            </span>
            <span className="text-[11px] tracking-widest uppercase text-gallery-accent font-medium">
              Coleção Oficial
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Editorial Event Showcase */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-8 text-center">
          <p className="text-[11px] font-sans font-light tracking-[0.3em] uppercase text-gallery-accent mb-3">
            Memória & Afeto
          </p>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-gallery-foreground tracking-tight leading-none mb-3">
            Aniversário da Vânia
          </h2>

          <p className="text-xl sm:text-2xl font-serif italic text-gallery-primary-soft mb-6 font-normal">
            uma celebração em imagens
          </p>

          <div className="w-16 h-px bg-gallery-accent/50 mx-auto mb-6" />

          <p className="text-xs sm:text-sm font-sans font-light text-gallery-muted max-w-xl mx-auto leading-relaxed">
            Galeria fotográfica com curadoria de registros originais. Clique sobre qualquer foto para apreciar os detalhes e realizar o download em alta resolução.
          </p>
        </section>

        {/* Gallery Component */}
        <ImageGallery />
      </main>

      {/* Editorial Luxury Footer */}
      <footer className="w-full border-t border-gallery-border py-12 px-6 text-center bg-gallery-surface">
        <p className="font-serif text-lg text-gallery-primary font-normal mb-1">
          Gabriel Gouveia Fotografias
        </p>
        <p className="font-sans text-[11px] font-light tracking-widest uppercase text-gallery-muted mb-4">
          Direitos autorais preservados • {GALLERY_STATS.totalCount} fotografias originais
        </p>
        <div className="w-8 h-px bg-gallery-border mx-auto mb-4" />
        <p className="font-sans text-[10px] text-gallery-muted/70 tracking-wider">
          Aniversário da Vânia • Exportação em alta definição para impressão e redes sociais
        </p>
      </footer>
    </div>
  );
}
