try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QPushButton, QLabel, QFrame
    from PySide6.QtCore import Signal, Qt
except ImportError:
    pass

class Sidebar(QWidget if 'QWidget' in globals() else object):
    """Collapsible navigation sidebar widget with active page signals."""

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        self.setFixedWidth(240)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 20, 16, 20)
        layout.setSpacing(10)

        title = QLabel("Navigation")
        title.setStyleSheet("font-size: 14px; font-weight: bold; color: #64748B;")
        layout.addWidget(title)

        nav_items = [
            ("Home", "home"),
            ("PDF Tools", "pdf_tools"),
            ("Image Tools", "image_tools"),
            ("Document Tools", "doc_tools"),
            ("History", "history"),
            ("Settings", "settings"),
            ("About", "about")
        ]

        self.buttons = {}
        for label, page_id in nav_items:
            btn = QPushButton(f"  {label}")
            btn.setCheckable(True)
            btn.setStyleSheet("""
                QPushButton {
                    text-align: left;
                    background-color: transparent;
                    color: #94A3B8;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 14px;
                }
                QPushButton:checked, QPushButton:hover {
                    background-color: #1E293B;
                    color: #2563EB;
                    font-weight: bold;
                }
            """)
            layout.addWidget(btn)
            self.buttons[page_id] = btn

        layout.addStretch()
