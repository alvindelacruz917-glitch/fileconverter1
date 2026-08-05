try:
    from PySide6.QtWidgets import QFrame, QVBoxLayout, QLabel, QPushButton
    from PySide6.QtCore import Signal, Qt
except ImportError:
    pass

class DropZone(QFrame if 'QFrame' in globals() else object):
    """Interactive drag and drop zone with file picker button."""

    files_dropped = Signal(list) if 'Signal' in globals() else None

    def __init__(self, parent=None, subtitle="Drag and drop your files here or click browse"):
        if 'QFrame' in globals():
            super().__init__(parent)
            self.subtitle = subtitle
            self.setAcceptDrops(True)
            self.init_ui()

    def init_ui(self):
        self.setObjectName("card")
        self.setMinimumHeight(220)
        self.setStyleSheet("""
            QFrame#card {
                border: 2px dashed #334155;
                border-radius: 20px;
                background-color: rgba(30, 41, 59, 0.5);
            }
            QFrame#card:hover {
                border-color: #2563EB;
                background-color: rgba(37, 99, 235, 0.05);
            }
        """)

        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)
        layout.setSpacing(12)

        icon_label = QLabel("📂")
        icon_label.setStyleSheet("font-size: 48px;")
        icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon_label)

        title = QLabel("Choose files or drag & drop them here")
        title.setStyleSheet("font-size: 16px; font-weight: bold; color: #F8FAFC;")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)

        sub = QLabel(self.subtitle)
        sub.setStyleSheet("font-size: 13px; color: #94A3B8;")
        sub.setAlignment(Qt.AlignCenter)
        layout.addWidget(sub)

        self.btn = QPushButton("Select Files")
        self.btn.setFixedWidth(160)
        layout.addWidget(self.btn, alignment=Qt.AlignCenter)
