'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn, getAssetUrl, downloadPhoto } from '@/lib/utils';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { galleryImages, GalleryImage } from '@/data/gallery';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Check,
} from 'lucide-react';

interface AnimatedImageProps {
  alt: string;
  src: string;
  className?: string;
  placeholder?: string;
  ratio: number;
  image: GalleryImage;
  onOpenLightbox: (image: GalleryImage) => void;
  onDownload: (image: GalleryImage, e: React.MouseEvent) => void;
}

function AnimatedImage({
  alt,
  src,
  ratio,
  placeholder,
  image,
  onOpenLightbox,
  onDownload,
}: AnimatedImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '180px' });
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleError = () => {
    if (placeholder) {
      setImgSrc(placeholder);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(image, e);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <div
      onClick={() => onOpenLightbox(image)}
      className="group relative cursor-pointer overflow-hidden rounded-md transition-all duration-700 ease-out hover:scale-[1.01] hover:shadow-lg hover:shadow-black/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gallery-accent"
      role="button"
      tabIndex={0}
      aria-label={`Ver fotografia: ${alt}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenLightbox(image);
        }
      }}
    >
      <AspectRatio
        ref={ref}
        ratio={ratio}
        className="bg-gallery-surface-secondary relative size-full rounded-md border border-gallery-border/80 overflow-hidden"
      >
        <img
          alt={alt}
          src={imgSrc}
          className={cn(
            'size-full rounded-md object-cover opacity-0 transition-opacity duration-1000 ease-in-out',
            {
              'opacity-100': isInView && !isLoading,
            }
          )}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          onError={handleError}
        />

        {/* Discreet editorial hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gallery-foreground/50 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 sm:flex sm:items-end sm:justify-between p-3.5 pointer-events-none">
          <div className="hidden sm:flex items-center text-xs font-sans">
            <span className="bg-gallery-surface/90 text-gallery-foreground font-medium text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-gallery-border/70 backdrop-blur-sm shadow-xs">
              {image.orientation === 'portrait' ? 'Vertical' : 'Horizontal'}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleDownloadClick}
              className="flex items-center gap-1.5 rounded-full bg-gallery-surface/95 text-gallery-foreground px-3 py-1.5 text-[11px] font-sans font-medium tracking-wide border border-gallery-border/80 shadow-xs transition hover:bg-gallery-primary hover:text-white active:scale-95"
              title="Baixar fotografia original"
              aria-label={`Baixar foto ${alt}`}
            >
              {isDownloaded ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>Baixado</span>
                </>
              ) : (
                <>
                  <Download className="size-3 stroke-[1.8]" />
                  <span className="hidden sm:inline">Baixar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenLightbox(image)}
              className="flex items-center justify-center size-7 rounded-full bg-gallery-surface/95 text-gallery-foreground border border-gallery-border/80 shadow-xs transition hover:bg-gallery-primary hover:text-white active:scale-95"
              title="Ampliar fotografia"
              aria-label="Ampliar fotografia"
            >
              <Maximize2 className="size-3 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}

// Hook to dynamically detect responsive columns
function useGalleryColumns() {
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
}

// Distributes images across columns balancing the total estimated height
function distributePhotos(images: GalleryImage[], numColumns: number): GalleryImage[][] {
  if (numColumns <= 1) {
    return [images];
  }

  const cols: GalleryImage[][] = Array.from({ length: numColumns }, () => []);
  const heights: number[] = Array.from({ length: numColumns }, () => 0);

  for (const img of images) {
    let shortestIndex = 0;
    for (let c = 1; c < numColumns; c++) {
      if (heights[c] < heights[shortestIndex]) {
        shortestIndex = c;
      }
    }
    cols[shortestIndex].push(img);
    heights[shortestIndex] += 1 / (img.ratio || 1);
  }

  return cols;
}

export function ImageGallery() {
  const columnCount = useGalleryColumns();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const columns = React.useMemo(
    () => distributePhotos(galleryImages, columnCount),
    [columnCount]
  );

  const selectedImage =
    selectedPhotoIndex !== null ? galleryImages[selectedPhotoIndex] : null;

  const handleOpenLightbox = (image: GalleryImage) => {
    const idx = galleryImages.findIndex((img) => img.id === image.id);
    if (idx !== -1) {
      setSelectedPhotoIndex(idx);
    }
  };

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + galleryImages.length) % galleryImages.length;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % galleryImages.length;
    });
  }, []);

  const handleDownload = useCallback(async (image: GalleryImage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDownloading(true);
    try {
      const originalUrl = getAssetUrl(image.originalSrc);
      await downloadPhoto(originalUrl, image.filename);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex, handleCloseLightbox, handlePrev, handleNext]);

  // Pre-load next and previous images
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const nextIdx = (selectedPhotoIndex + 1) % galleryImages.length;
    const prevIdx = (selectedPhotoIndex - 1 + galleryImages.length) % galleryImages.length;

    const nextImg = new Image();
    nextImg.src = getAssetUrl(galleryImages[nextIdx].previewSrc);

    const prevImg = new Image();
    prevImg.src = getAssetUrl(galleryImages[prevIdx].previewSrc);
  }, [selectedPhotoIndex]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-10 px-4 sm:px-6">
      {/* 3-Column Grid preserving the base component structure */}
      <div
        className={cn(
          'mx-auto grid w-full max-w-6xl gap-6 sm:gap-7',
          columnCount === 1 && 'grid-cols-1',
          columnCount === 2 && 'grid-cols-2',
          columnCount === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {columns.map((columnImages, col) => (
          <div key={col} className="grid gap-6 sm:gap-7 content-start">
            {columnImages.map((image) => (
              <AnimatedImage
                key={image.id}
                alt={image.alt}
                src={getAssetUrl(image.previewSrc)}
                ratio={image.ratio}
                image={image}
                onOpenLightbox={handleOpenLightbox}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Editorial Lightbox with Warm Dark Ambience */}
      <AnimatePresence>
        {selectedImage && selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-lightbox-bg/96 backdrop-blur-md select-none"
            onClick={handleCloseLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Visualizador: ${selectedImage.alt}`}
          >
            {/* Lightbox Header */}
            <div
              className="flex items-center justify-between px-5 py-4 sm:px-8 border-b border-lightbox-border z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <span className="font-serif text-lg text-lightbox-text tracking-wide leading-tight">
                  Aniversário da Vânia
                </span>
                <span className="font-sans text-[11px] font-light text-lightbox-muted tracking-wider">
                  Fotografia {selectedPhotoIndex + 1} de {galleryImages.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedImage)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-sans tracking-wide text-lightbox-text border border-lightbox-border transition hover:bg-gallery-accent hover:border-gallery-accent hover:text-white active:scale-95 disabled:opacity-50"
                  aria-label="Baixar fotografia original"
                >
                  <Download className="size-3.5 stroke-[1.8]" />
                  <span>{isDownloading ? 'Baixando...' : 'Baixar fotografia'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-lightbox-text border border-lightbox-border transition hover:bg-white hover:text-black active:scale-95"
                  aria-label="Fechar visualização (ESC)"
                  title="Fechar (Esc)"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Central Stage */}
            <div className="relative flex flex-1 items-center justify-center p-3 sm:p-6 overflow-hidden">
              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-6 z-20 flex size-11 items-center justify-center rounded-full bg-lightbox-surface/80 text-lightbox-text border border-lightbox-border backdrop-blur-sm transition hover:bg-white hover:text-black active:scale-95 focus:outline-none"
                aria-label="Fotografia anterior"
                title="Foto anterior (Seta esquerda)"
              >
                <ChevronLeft className="size-5 stroke-[1.8]" />
              </button>

              {/* Photo Display */}
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative max-h-[82vh] max-w-[92vw] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getAssetUrl(selectedImage.originalSrc)}
                  alt={selectedImage.alt}
                  className="max-h-[80vh] max-w-[88vw] rounded-md object-contain shadow-2xl ring-1 ring-white/10"
                />
              </motion.div>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-6 z-20 flex size-11 items-center justify-center rounded-full bg-lightbox-surface/80 text-lightbox-text border border-lightbox-border backdrop-blur-sm transition hover:bg-white hover:text-black active:scale-95 focus:outline-none"
                aria-label="Próxima fotografia"
                title="Próxima foto (Seta direita)"
              >
                <ChevronRight className="size-5 stroke-[1.8]" />
              </button>
            </div>

            {/* Lightbox Footer Bar */}
            <div
              className="flex items-center justify-between px-5 py-3 sm:px-8 border-t border-lightbox-border text-[11px] font-sans font-light text-lightbox-muted z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span>{selectedImage.width} × {selectedImage.height} px</span>
                <span className="opacity-40">•</span>
                <span>{Math.round(selectedImage.sizeBytes / 1024)} KB</span>
                <span className="hidden sm:inline opacity-40">•</span>
                <span className="hidden sm:inline capitalize">{selectedImage.orientation === 'portrait' ? 'Vertical' : 'Horizontal'}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-lightbox-muted/70">
                  Navegue com ← → ou ESC para fechar
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
