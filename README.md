# Universal File Converter (Desktop & Web)

A professional, high-performance universal file converter desktop application built with **Python 3.13** and **PySide6 (Qt6)**, paired with a web companion interface.

![Universal File Converter](assets/banner.png)

## 🌟 Key Features

- **Modular Clean Architecture**: Built with separation of concerns (`core`, `converters`, `pages`, `widgets`, `workers`, `history`, `themes`).
- **Complete Suite of 45+ Tools**:
  - **PDF Tools**: Image to PDF, PDF to Image, PDF to Word/Excel/PowerPoint/Text, Word/Excel/PowerPoint/Text to PDF, Merge, Split, Compress, Rotate, Protect, Unlock, Watermark, Reorder Pages, OCR PDF.
  - **Image Tools**: JPG, PNG, WEBP, BMP, TIFF, GIF, HEIC, ICO, SVG conversions, Resize, Compress, Crop, Rotate, Flip, Watermark, Background Removal.
  - **Document Tools**: DOCX to TXT, TXT to DOCX, HTML to PDF/DOCX, XLSX to CSV, CSV to XLSX.
- **Dedicated Image-to-PDF Studio**: Drag to reorder pages, paper size selection (A4, Letter, Legal), orientation controls, margin adjustments, image fit mode, quality compression, live thumbnail previews.
- **Batch Processing & Multi-threading**: Fast conversion pipeline using background QThread workers without freezing the UI.
- **Custom Modern Qt Design**: Premium dark and light mode stylesheets, rounded corners (18-20px), soft shadows, hover animations, responsive layouts, SVG icons.
- **Conversion History & Persistence**: Persistent history log with search, filters, and file tracking.
- **Settings & Auto-Preferences**: Accent color picker, default output folder, auto-open output option.

---

## 🚀 Desktop Application Setup (Python 3.13 + PySide6)

### Prerequisites
- Python 3.10+ (Python 3.13 recommended)
- `pip`

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/universal-software/universal-file-converter.git
   cd universal-file-converter
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python main.py
   ```

---

## 🛠️ Project Structure

```text
universal-file-converter/
├── main.py                     # Main application entry point
├── requirements.txt            # Python dependencies
├── README.md                   # Documentation
├── app/                        # Application initialization and window frame
│   ├── __init__.py
│   └── application.py
├── core/                       # App configuration, logging, theme manager
│   ├── __init__.py
│   ├── config.py
│   ├── logger.py
│   └── theme.py
├── converters/                 # Conversion engine modules
│   ├── __init__.py
│   ├── base_converter.py
│   ├── pdf_converters.py
│   ├── image_converters.py
│   └── doc_converters.py
├── history/                    # Conversion history storage manager
│   ├── __init__.py
│   └── history_manager.py
├── pages/                      # Application view pages
│   ├── __init__.py
│   ├── home_page.py
│   ├── pdf_tools_page.py
│   ├── image_tools_page.py
│   ├── doc_tools_page.py
│   ├── converter_page.py
│   ├── image_to_pdf_page.py
│   ├── history_page.py
│   ├── settings_page.py
│   └── about_page.py
├── widgets/                    # Custom Qt reusable UI controls
│   ├── __init__.py
│   ├── sidebar.py
│   ├── top_bar.py
│   ├── drop_zone.py
│   ├── tool_card.py
│   ├── file_item.py
│   ├── progress_dialog.py
│   └── toast.py
├── workers/                    # Background threads for non-blocking conversion
│   ├── __init__.py
│   └── conversion_worker.py
├── themes/                     # Qt Style Sheets (QSS)
│   ├── light.qss
│   └── dark.qss
└── utils/                      # Helper routines and file utilities
    ├── __init__.py
    └── file_utils.py
```

---

## 🎨 Design System & Styling

- **Primary Color**: `#2563EB`
- **Accent Color**: `#7C3AED`
- **Light Theme**: Background `#F8FAFC`, Cards `#FFFFFF`
- **Dark Theme**: Background `#0F172A`, Cards `#1E293B`
- **Border Radius**: `18px` - `20px`

---

## 📜 License
MIT License. Created by Universal Software Corp.
