import { ConverterTool } from '../types/converter';

export const ALL_TOOLS: ConverterTool[] = [
  // --- PDF TOOLS ---
  {
    id: 'img_to_pdf',
    name: 'Image to PDF',
    category: 'pdf',
    icon: 'FileImage',
    description: 'Combine JPG, PNG, WEBP, BMP, TIFF images into a single PDF document',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif', '.heic'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_to_word',
    name: 'PDF to Word',
    category: 'pdf',
    icon: 'FileText',
    description: 'Convert PDF documents into editable Word DOCX format',
    acceptedTypes: ['.pdf'],
    targetExtension: 'docx',
    popular: true
  },
  {
    id: 'word_to_pdf',
    name: 'Word to PDF',
    category: 'pdf',
    icon: 'FileType',
    description: 'Turn Word DOCX or DOC documents into formatted PDF files',
    acceptedTypes: ['.docx', '.doc'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_merge',
    name: 'Merge PDF',
    category: 'pdf',
    icon: 'Layers',
    description: 'Combine multiple PDF files into one clean document',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_split',
    name: 'Split PDF',
    category: 'pdf',
    icon: 'Scissors',
    description: 'Separate PDF into individual page ranges or single pages',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_compress',
    name: 'Compress PDF',
    category: 'pdf',
    icon: 'Minimize2',
    description: 'Reduce PDF file size while maintaining optical document quality',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_to_img',
    name: 'PDF to Image',
    category: 'pdf',
    icon: 'Image',
    description: 'Extract PDF pages as high-resolution JPG or PNG images',
    acceptedTypes: ['.pdf'],
    targetExtension: 'png',
    popular: true
  },
  {
    id: 'excel_to_pdf',
    name: 'Excel to PDF',
    category: 'pdf',
    icon: 'FileSpreadsheet',
    description: 'Turn XLSX spreadsheet sheets into clean PDF tables',
    acceptedTypes: ['.xlsx', '.xls'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'pdf_to_excel',
    name: 'PDF to Excel',
    category: 'pdf',
    icon: 'Table',
    description: 'Extract tabular data from PDF files to Excel XLSX',
    acceptedTypes: ['.pdf'],
    targetExtension: 'xlsx',
    popular: true
  },
  {
    id: 'pdf_ocr',
    name: 'OCR PDF',
    category: 'pdf',
    icon: 'ScanText',
    description: 'Recognize scanned document text and turn scans into searchable PDF',
    acceptedTypes: ['.pdf', '.png', '.jpg'],
    targetExtension: 'pdf',
    popular: true
  },
  {
    id: 'image_to_text',
    name: 'Image to Text (AI OCR)',
    category: 'utility',
    icon: 'FileText',
    description: 'Use Gemini AI OCR to extract readable text, optical notes, and transcriptions from images or photos',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif'],
    targetExtension: 'txt',
    popular: true
  },
  {
    id: 'image_to_word',
    name: 'Image to Word (AI OCR)',
    category: 'utility',
    icon: 'FileType',
    description: 'Convert scanned document photos or image text into editable Word (.docx) document using AI',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.heic'],
    targetExtension: 'docx',
    popular: true
  },
  {
    id: 'pdf_to_pptx',
    name: 'PDF to PowerPoint',
    category: 'pdf',
    icon: 'Presentation',
    description: 'Convert PDF slides into editable PowerPoint PPTX presentation',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pptx'
  },
  {
    id: 'pptx_to_pdf',
    name: 'PowerPoint to PDF',
    category: 'pdf',
    icon: 'Monitor',
    description: 'Convert PPTX slides into printable PDF document',
    acceptedTypes: ['.pptx', '.ppt'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_to_txt',
    name: 'PDF to Text',
    category: 'pdf',
    icon: 'AlignLeft',
    description: 'Extract raw text contents from PDF documents',
    acceptedTypes: ['.pdf'],
    targetExtension: 'txt'
  },
  {
    id: 'txt_to_pdf',
    name: 'Text to PDF',
    category: 'pdf',
    icon: 'FileCode',
    description: 'Convert plain text files into clean PDF layout',
    acceptedTypes: ['.txt'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_rotate',
    name: 'Rotate PDF',
    category: 'pdf',
    icon: 'RotateCw',
    description: 'Rotate PDF pages 90, 180, or 270 degrees',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_protect',
    name: 'Protect PDF',
    category: 'pdf',
    icon: 'Lock',
    description: 'Encrypt PDF files with strong password security',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_unlock',
    name: 'Unlock PDF',
    category: 'pdf',
    icon: 'Unlock',
    description: 'Remove owner passwords and restrictions from PDF',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_watermark',
    name: 'Add Watermark',
    category: 'pdf',
    icon: 'Droplets',
    description: 'Overlay custom text or logo watermarks onto PDF pages',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_remove_watermark',
    name: 'Remove Watermark',
    category: 'pdf',
    icon: 'Sparkles',
    description: 'Clean up unwanted watermarks or stamps from PDF',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },
  {
    id: 'pdf_extract',
    name: 'Extract Pages',
    category: 'pdf',
    icon: 'FileOutput',
    description: 'Extract specific pages into a new PDF document',
    acceptedTypes: ['.pdf'],
    targetExtension: 'pdf'
  },

  // --- IMAGE TOOLS ---
  {
    id: 'image_bg_remove',
    name: 'Remove Background',
    category: 'image',
    icon: 'Scissors',
    description: 'AI Background Remover - Remove image backgrounds automatically and export clean transparent PNGs',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.heic'],
    targetExtension: 'png',
    popular: true
  },
  {
    id: 'any_image_converter',
    name: 'Universal Image Converter',
    category: 'image',
    icon: 'Layers',
    description: 'Convert ANY image format (JPG, PNG, WEBP, HEIC, BMP, SVG, GIF, TIFF, ICO) to ANY file format (PNG, JPG, WEBP, PDF, DOCX, TXT, SVG, BMP, ICO)',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'png',
    popular: true
  },
  {
    id: 'jpg_to_png',
    name: 'JPG to PNG',
    category: 'image',
    icon: 'Repeat',
    description: 'Convert JPG or any image into transparent PNG format',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'png',
    popular: true
  },
  {
    id: 'png_to_jpg',
    name: 'PNG to JPG',
    category: 'image',
    icon: 'RefreshCw',
    description: 'Convert PNG or any image to standard compressed JPG format',
    acceptedTypes: ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'jpg',
    popular: true
  },
  {
    id: 'jpg_to_webp',
    name: 'JPG to WEBP',
    category: 'image',
    icon: 'Zap',
    description: 'Convert JPG or any image to web-optimized high-efficiency WEBP format',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'webp'
  },
  {
    id: 'webp_to_jpg',
    name: 'WEBP to JPG',
    category: 'image',
    icon: 'ImageIcon',
    description: 'Convert WEBP or any image back to standard JPG format',
    acceptedTypes: ['.webp', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'jpg'
  },
  {
    id: 'png_to_webp',
    name: 'PNG to WEBP',
    category: 'image',
    icon: 'Sparkle',
    description: 'Convert PNG or any image to compact WEBP format with alpha transparency',
    acceptedTypes: ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'webp'
  },
  {
    id: 'webp_to_png',
    name: 'WEBP to PNG',
    category: 'image',
    icon: 'Maximize2',
    description: 'Convert WEBP or any image into uncompressed PNG format',
    acceptedTypes: ['.webp', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'png'
  },
  {
    id: 'bmp_to_png',
    name: 'BMP to PNG',
    category: 'image',
    icon: 'Image',
    description: 'Convert bitmap BMP graphics or any image into optimized PNG format',
    acceptedTypes: ['.bmp', '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'png'
  },
  {
    id: 'tiff_to_jpg',
    name: 'TIFF to JPG',
    category: 'image',
    icon: 'Camera',
    description: 'Convert multi-layer or raw TIFF photos or any image to JPG format',
    acceptedTypes: ['.tiff', '.tif', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'jpg'
  },
  {
    id: 'gif_to_png',
    name: 'GIF to PNG',
    category: 'image',
    icon: 'Film',
    description: 'Extract static frames from GIF animations or convert any image to PNG',
    acceptedTypes: ['.gif', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.heic', '.heif', '.ico', '.svg', '.avif'],
    targetExtension: 'png'
  },
  {
    id: 'heic_to_jpg',
    name: 'HEIC to JPG',
    category: 'image',
    icon: 'Smartphone',
    description: 'Convert iPhone HEIC photos or any image into standard JPG format',
    acceptedTypes: ['.heic', '.heif', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.ico', '.svg', '.avif'],
    targetExtension: 'jpg'
  },
  {
    id: 'ico_to_png',
    name: 'ICO to PNG',
    category: 'image',
    icon: 'Disc',
    description: 'Convert favicon icon ICO files or any image to PNG format',
    acceptedTypes: ['.ico', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.svg', '.avif'],
    targetExtension: 'png'
  },
  {
    id: 'svg_to_png',
    name: 'SVG to PNG',
    category: 'image',
    icon: 'Feather',
    description: 'Render vector SVG graphics or any image into raster PNG format',
    acceptedTypes: ['.svg', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.gif', '.heic', '.heif', '.ico', '.avif'],
    targetExtension: 'png'
  },
  {
    id: 'image_resize',
    name: 'Resize Image',
    category: 'image',
    icon: 'Scaling',
    description: 'Resize image dimensions by width, height, or scaling ratio',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    targetExtension: 'png'
  },
  {
    id: 'image_compress',
    name: 'Compress Image',
    category: 'image',
    icon: 'Sliders',
    description: 'Compress image file sizes with custom quality slider',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    targetExtension: 'jpg'
  },
  {
    id: 'image_crop',
    name: 'Crop Image',
    category: 'image',
    icon: 'Crop',
    description: 'Crop custom rectangular regions from image graphics',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    targetExtension: 'png'
  },
  {
    id: 'image_rotate',
    name: 'Rotate Image',
    category: 'image',
    icon: 'RotateCw',
    description: 'Rotate images 90, 180, or 270 degrees clockwise',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    targetExtension: 'png'
  },
  {
    id: 'image_flip',
    name: 'Flip Image',
    category: 'image',
    icon: 'FlipHorizontal',
    description: 'Flip images horizontally or vertically',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    targetExtension: 'png'
  },
  {
    id: 'image_watermark',
    name: 'Add Watermark',
    category: 'image',
    icon: 'Stamp',
    description: 'Apply semi-transparent text or logo watermark onto images',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    targetExtension: 'png'
  },

  // --- DOCUMENT TOOLS ---
  {
    id: 'docx_to_txt',
    name: 'DOCX to TXT',
    category: 'document',
    icon: 'FileText',
    description: 'Extract raw text paragraphs from Microsoft Word DOCX files',
    acceptedTypes: ['.docx', '.doc'],
    targetExtension: 'txt'
  },
  {
    id: 'txt_to_docx',
    name: 'TXT to DOCX',
    category: 'document',
    icon: 'FileCheck',
    description: 'Convert plain text files into structured Word DOCX documents',
    acceptedTypes: ['.txt'],
    targetExtension: 'docx'
  },
  {
    id: 'html_to_pdf',
    name: 'HTML to PDF',
    category: 'document',
    icon: 'Globe',
    description: 'Render webpage HTML documents directly into formatted PDF',
    acceptedTypes: ['.html', '.htm'],
    targetExtension: 'pdf'
  },
  {
    id: 'html_to_docx',
    name: 'HTML to DOCX',
    category: 'document',
    icon: 'Code',
    description: 'Convert HTML webpage files into editable Word documents',
    acceptedTypes: ['.html', '.htm'],
    targetExtension: 'docx'
  },
  {
    id: 'xlsx_to_csv',
    name: 'XLSX to CSV',
    category: 'document',
    icon: 'Sheet',
    description: 'Export Excel spreadsheet worksheets to standard CSV files',
    acceptedTypes: ['.xlsx', '.xls'],
    targetExtension: 'csv'
  },
  {
    id: 'csv_to_xlsx',
    name: 'CSV to XLSX',
    category: 'document',
    icon: 'FileSpreadsheet',
    description: 'Import CSV data spreadsheets into formatted Excel XLSX workbooks',
    acceptedTypes: ['.csv'],
    targetExtension: 'xlsx'
  }
];

export const POPULAR_TOOLS = ALL_TOOLS.filter((t) => t.popular);
