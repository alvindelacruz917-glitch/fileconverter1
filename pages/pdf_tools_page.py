try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QGridLayout, QScrollArea, QFrame
    from PySide6.QtCore import Signal
    from widgets.tool_card import ToolCard
except ImportError:
    pass

class PdfToolsPage(QWidget if 'QWidget' in globals() else object):
    """Grid page showing all PDF Conversion and Manipulation Tools."""

    tool_selected = Signal(str) if 'Signal' in globals() else None

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)

        content = QWidget()
        layout = QVBoxLayout(content)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(20)

        title = QLabel("PDF Tools")
        title.setStyleSheet("font-size: 26px; font-weight: 800; color: #F8FAFC;")
        layout.addWidget(title)

        sub = QLabel("Comprehensive suite for converting, merging, splitting, compressing, and editing PDF files.")
        sub.setStyleSheet("font-size: 14px; color: #94A3B8;")
        layout.addWidget(sub)

        pdf_tools = [
            ("img_to_pdf", "🖼️", "Image to PDF", "Convert JPG, PNG, WEBP, BMP to PDF"),
            ("pdf_to_img", "📸", "PDF to Image", "Extract PDF pages to PNG or JPG images"),
            ("pdf_to_word", "📄", "PDF to Word", "Convert PDF to editable DOCX document"),
            ("word_to_pdf", "📝", "Word to PDF", "Convert Word DOCX documents to PDF"),
            ("pdf_to_excel", "📊", "PDF to Excel", "Extract spreadsheet tables to Excel XLSX"),
            ("excel_to_pdf", "📈", "Excel to PDF", "Convert XLSX sheets to PDF"),
            ("pdf_to_pptx", "💻", "PDF to PowerPoint", "Convert PDF to PPTX slides"),
            ("pptx_to_pdf", "🖥️", "PowerPoint to PDF", "Convert PPTX presentations to PDF"),
            ("pdf_to_txt", "🔤", "PDF to Text", "Extract plain text from PDF document"),
            ("txt_to_pdf", "📄", "Text to PDF", "Convert text files into clean PDF"),
            ("pdf_merge", "🧩", "Merge PDF", "Combine multiple PDFs into a single file"),
            ("pdf_split", "✂️", "Split PDF", "Separate PDF into individual pages"),
            ("pdf_compress", "📉", "Compress PDF", "Optimize and shrink PDF size"),
            ("pdf_rotate", "🔄", "Rotate PDF", "Rotate PDF pages 90, 180, 270 degrees"),
            ("pdf_protect", "🔒", "Protect PDF", "Encrypt PDF with a password"),
            ("pdf_unlock", "🔓", "Unlock PDF", "Remove password security from PDF"),
            ("pdf_watermark", "💧", "Add Watermark", "Add text or image watermark to PDF"),
            ("pdf_remove_watermark", "🧼", "Remove Watermark", "Clear text or logo watermarks from PDF"),
            ("pdf_extract", "📑", "Extract Pages", "Save selected pages as a new PDF"),
            ("pdf_delete", "🗑️", "Delete Pages", "Remove unwanted pages from PDF"),
            ("pdf_reorder", "🔀", "Reorder Pages", "Rearrange page ordering in PDF"),
            ("pdf_ocr", "🔍", "OCR PDF", "Scan image PDF and make text searchable"),
        ]

        grid = QGridLayout()
        grid.setSpacing(16)

        for i, (t_id, icon, name, desc) in enumerate(pdf_tools):
            card = ToolCard(t_id, icon, name, desc)
            if hasattr(card, "clicked") and card.clicked:
                card.clicked.connect(lambda id=t_id: self.tool_selected.emit(id) if self.tool_selected else None)
            grid.addWidget(card, i // 3, i % 3)

        layout.addLayout(grid)
        scroll.setWidget(content)
        main_layout.addWidget(scroll)
