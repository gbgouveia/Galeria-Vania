import os
import shutil
import json
import re
from PIL import Image

SOURCE_DIR = r"D:\Gabriel Gouveia Fotografias\2026\Exportadas\Aniversario vania - Redes Sociais"
BASE_OUT_DIR = os.path.join(os.getcwd(), "public", "gallery", "aniversario-vania")
ORIGINAL_DIR = os.path.join(BASE_OUT_DIR, "original")
PREVIEW_DIR = os.path.join(BASE_OUT_DIR, "preview")
DATA_OUT_FILE = os.path.join(os.getcwd(), "src", "data", "gallery.ts")

os.makedirs(ORIGINAL_DIR, exist_ok=True)
os.makedirs(PREVIEW_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_OUT_FILE), exist_ok=True)

files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
files.sort()

print(f"Total photos found: {len(files)}")

gallery_data = []
total_original_bytes = 0
total_preview_bytes = 0

for idx, filename in enumerate(files, start=1):
    src_path = os.path.join(SOURCE_DIR, filename)
    stat = os.stat(src_path)
    file_size = stat.st_size
    total_original_bytes += file_size
    
    # Extract number if possible, or format 4 digits
    match = re.search(r'(\d+)', filename)
    num_str = f"{idx:04d}"
    
    safe_name = f"aniversario-vania-{num_str}"
    orig_name = f"{safe_name}.jpg"
    preview_name = f"{safe_name}.webp"
    
    dest_orig = os.path.join(ORIGINAL_DIR, orig_name)
    dest_preview = os.path.join(PREVIEW_DIR, preview_name)
    
    # Open image to get dimensions
    with Image.open(src_path) as img:
        width, height = img.size
        orientation = "portrait" if height > width else "landscape"
        ratio = round(width / height, 4)
        
        # Copy original if not already copied
        if not os.path.exists(dest_orig):
            shutil.copy2(src_path, dest_orig)
            
        # Create preview webp (max 1600px width/height, quality 85)
        if not os.path.exists(dest_preview):
            preview_img = img.copy()
            # If large, resize smoothly
            preview_img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            preview_img.save(dest_preview, "WEBP", quality=85, method=6)
            
    preview_size = os.path.getsize(dest_preview)
    total_preview_bytes += preview_size
    
    gallery_data.append({
        "id": idx,
        "filename": orig_name,
        "previewFilename": preview_name,
        "alt": f"Aniversário da Vânia - Foto {idx:03d}",
        "width": width,
        "height": height,
        "ratio": ratio,
        "orientation": orientation,
        "sizeBytes": file_size,
        "originalSrc": f"gallery/aniversario-vania/original/{orig_name}",
        "previewSrc": f"gallery/aniversario-vania/preview/{preview_name}"
    })
    
    if idx % 25 == 0 or idx == len(files):
        print(f"Processed {idx}/{len(files)}...")

ts_content = f"""// Catálogo de fotografias reais do Aniversário da Vânia
// Gerado automaticamente com base nos arquivos originais

export interface GalleryImage {{
  id: number;
  filename: string;
  previewFilename: string;
  alt: string;
  width: number;
  height: number;
  ratio: number;
  orientation: 'portrait' | 'landscape';
  sizeBytes: number;
  originalSrc: string;
  previewSrc: string;
}}

export const galleryImages: GalleryImage[] = {json.dumps(gallery_data, indent=2)};

export const GALLERY_STATS = {{
  totalCount: {len(gallery_data)},
  totalOriginalMB: {round(total_original_bytes / (1024 * 1024), 2)},
  totalPreviewMB: {round(total_preview_bytes / (1024 * 1024), 2)},
}};
"""

with open(DATA_OUT_FILE, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Done! {len(gallery_data)} photos processed.")
print(f"Total original size: {round(total_original_bytes / (1024 * 1024), 2)} MB")
print(f"Total preview size: {round(total_preview_bytes / (1024 * 1024), 2)} MB")
