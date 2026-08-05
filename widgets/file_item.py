try:
    from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QPushButton
    from PySide6.QtCore import Signal
except ImportError:
    pass

class FileItemWidget(QFrame if 'QFrame' in globals() else object):
    """File item widget displayed in conversion queues with remove button."""

    removed = Signal(str) if 'Signal' in globals() else None

    def __init__(self, file_path: str, size_str: str, parent=None):
        if 'QFrame' in globals():
            super().__init__(parent)
            self.file_path = file_path
            self.size_str = size_str
            self.init_ui()

    def init_ui(self):
        self.setStyleSheet("""
            QFrame {
                background-color: #1E293B;
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 6px 12px;
            }
        """)

        layout = QHBoxLayout(self)
        layout.setContentsMargins(10, 8, 10, 8)

        icon_label = QLabel("📄")
        icon_label.setStyleSheet("font-size: 18px;")
        layout.addWidget(icon_label)

        from pathlib import Path
        p = Path(self.file_path)
        name_label = QLabel(p.name)
        name_label.setStyleSheet("font-weight: 600; font-size: 13px;")
        layout.addWidget(name_label)

        size_label = QLabel(self.size_str)
        size_label.setStyleSheet("color: #94A3B8; font-size: 12px;")
        layout.addWidget(size_label)

        layout.addStretch()

        remove_btn = QPushButton("✕")
        remove_btn.setFixedSize(24, 24)
        remove_btn.setStyleSheet("""
            QPushButton {
                background-color: transparent;
                color: #EF4444;
                border: none;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: rgba(239, 68, 68, 0.1);
                border-radius: 12px;
            }
        """)
        layout.addWidget(remove_btn)
