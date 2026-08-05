try:
    from PySide6.QtWidgets import QWidget, QHBoxLayout, QLabel, QLineEdit, QPushButton
    from PySide6.QtCore import Signal
except ImportError:
    pass

class TopBar(QWidget if 'QWidget' in globals() else object):
    """Top header containing logo, search input, dark mode toggle and settings button."""

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 15, 20, 15)

        logo_label = QLabel("⚡ Universal File Converter")
        logo_label.setStyleSheet("font-size: 18px; font-weight: 800; color: #2563EB;")
        layout.addWidget(logo_label)

        layout.addStretch()

        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Search converter tools... (e.g. PDF to Word, WEBP)")
        self.search_input.setFixedWidth(300)
        layout.addWidget(self.search_input)

        self.theme_btn = QPushButton("🌙 Dark / ☀️ Light")
        self.theme_btn.setObjectName("secondaryBtn")
        layout.addWidget(self.theme_btn)

        self.settings_btn = QPushButton("⚙️ Settings")
        self.settings_btn.setObjectName("secondaryBtn")
        layout.addWidget(self.settings_btn)
