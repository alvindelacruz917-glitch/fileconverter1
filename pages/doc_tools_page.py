try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QGridLayout, QScrollArea, QFrame
    from PySide6.QtCore import Signal
    from widgets.tool_card import ToolCard
except ImportError:
    pass

class DocToolsPage(QWidget if 'QWidget' in globals() else object):
    """Grid page showing all Document & Spreadsheet Tools."""

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

        title = QLabel("Document Tools")
        title.setStyleSheet("font-size: 26px; font-weight: 800; color: #F8FAFC;")
        layout.addWidget(title)

        sub = QLabel("Convert Word documents, plain text, HTML, Excel spreadsheets, and CSV data.")
        sub.setStyleSheet("font-size: 14px; color: #94A3B8;")
        layout.addWidget(sub)

        doc_tools = [
            ("docx_to_txt", "📝", "DOCX to TXT", "Extract plain text content from Word DOCX"),
            ("txt_to_docx", "📄", "TXT to DOCX", "Convert plain text files into formatted Word DOCX"),
            ("html_to_pdf", "🌐", "HTML to PDF", "Render webpage HTML files into PDF document"),
            ("html_to_docx", "📑", "HTML to DOCX", "Convert web HTML pages into Word DOCX"),
            ("xlsx_to_csv", "📊", "XLSX to CSV", "Export Excel sheets to standard CSV format"),
            ("csv_to_xlsx", "📈", "CSV to XLSX", "Import CSV spreadsheet files into Excel XLSX format"),
        ]

        grid = QGridLayout()
        grid.setSpacing(16)

        for i, (t_id, icon, name, desc) in enumerate(doc_tools):
            card = ToolCard(t_id, icon, name, desc)
            if hasattr(card, "clicked") and card.clicked:
                card.clicked.connect(lambda id=t_id: self.tool_selected.emit(id) if self.tool_selected else None)
            grid.addWidget(card, i // 3, i % 3)

        layout.addLayout(grid)
        scroll.setWidget(content)
        main_layout.addWidget(scroll)
