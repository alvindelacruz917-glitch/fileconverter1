try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QGridLayout, QScrollArea, QFrame, QPushButton
    from PySide6.QtCore import Signal, Qt
    from widgets.drop_zone import DropZone
    from widgets.tool_card import ToolCard
except ImportError:
    pass

class HomePage(QWidget if 'QWidget' in globals() else object):
    """Main dashboard home page featuring Hero section and Popular Tools cards."""

    tool_selected = Signal(str) if 'Signal' in globals() else None

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)

        content = QWidget()
        layout = QVBoxLayout(content)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(24)

        # HERO SECTION
        hero = QFrame()
        hero.setObjectName("card")
        hero_layout = QVBoxLayout(hero)
        hero_layout.setContentsMargins(40, 35, 40, 35)
        hero_layout.setSpacing(12)

        title = QLabel("Convert Files Instantly")
        title.setStyleSheet("font-size: 32px; font-weight: 800; color: #F8FAFC;")
        hero_layout.addWidget(title)

        subtitle = QLabel("Fast • Secure • Offline")
        subtitle.setStyleSheet("font-size: 15px; font-weight: 600; color: #2563EB;")
        hero_layout.addWidget(subtitle)

        # Hero Drop Zone
        self.drop_zone = DropZone(subtitle="Drop any file here to automatically open the right converter tool")
        hero_layout.addWidget(self.drop_zone)

        layout.addWidget(hero)

        # POPULAR TOOLS SECTION
        tools_label = QLabel("POPULAR TOOLS")
        tools_label.setStyleSheet("font-size: 14px; font-weight: 800; color: #94A3B8; letter-spacing: 1.5px;")
        layout.addWidget(tools_label)

        grid = QGridLayout()
        grid.setSpacing(16)

        popular_tools = [
            # Row 1
            ("img_to_pdf", "🖼️", "Image to PDF", "Combine JPG, PNG into a clean PDF"),
            ("pdf_to_word", "📄", "PDF to Word", "Convert PDF to editable DOCX"),
            ("word_to_pdf", "📝", "Word to PDF", "Turn DOCX files into PDF documents"),
            ("pdf_merge", "🧩", "Merge PDF", "Combine multiple PDFs into one file"),
            # Row 2
            ("pdf_split", "✂️", "Split PDF", "Separate PDF pages or extract page ranges"),
            ("pdf_compress", "📉", "Compress PDF", "Reduce PDF file size while keeping quality"),
            ("pdf_to_img", "🖼️", "PDF to Image", "Extract PDF pages as JPG or PNG images"),
            ("jpg_to_png", "🔁", "JPG to PNG", "Convert JPG images to PNG transparent format"),
            # Row 3
            ("png_to_jpg", "🔄", "PNG to JPG", "Convert PNG images to standard JPG format"),
            ("excel_to_pdf", "📊", "Excel to PDF", "Turn XLSX spreadsheets into PDF tables"),
            ("pdf_to_excel", "📈", "PDF to Excel", "Extract tables from PDF to Excel XLSX"),
            ("pdf_ocr", "🔍", "OCR PDF", "Recognize text from scanned PDF documents"),
        ]

        for i, (t_id, icon, name, desc) in enumerate(popular_tools):
            row = i // 4
            col = i % 4
            card = ToolCard(t_id, icon, name, desc)
            if hasattr(card, "clicked") and card.clicked:
                card.clicked.connect(self._on_card_click)
            grid.addWidget(card, row, col)

        layout.addLayout(grid)
        scroll.setWidget(content)
        main_layout.addWidget(scroll)

    def _on_card_click(self, tool_id):
        if hasattr(self, "tool_selected") and self.tool_selected:
            self.tool_selected.emit(tool_id)
