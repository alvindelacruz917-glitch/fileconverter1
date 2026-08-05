try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QFrame
    from PySide6.QtCore import Qt
    from core.config import APP_NAME, APP_VERSION, ORGANIZATION
except ImportError:
    pass

class AboutPage(QWidget if 'QWidget' in globals() else object):
    """About dialog page showing version, license, credits and GitHub button."""

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setAlignment(Qt.AlignCenter)

        card = QFrame()
        card.setObjectName("card")
        card.setFixedWidth(500)
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(40, 40, 40, 40)
        card_layout.setAlignment(Qt.AlignCenter)
        card_layout.setSpacing(16)

        logo = QLabel("⚡")
        logo.setStyleSheet("font-size: 64px;")
        logo.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(logo)

        name = QLabel(APP_NAME if 'APP_NAME' in globals() else "Universal File Converter")
        name.setStyleSheet("font-size: 24px; font-weight: 800; color: #2563EB;")
        name.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(name)

        ver = QLabel(f"Version {APP_VERSION if 'APP_VERSION' in globals() else '2.5.0 Pro'}")
        ver.setStyleSheet("font-size: 14px; color: #94A3B8;")
        ver.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(ver)

        dev = QLabel(f"Developed by {ORGANIZATION if 'ORGANIZATION' in globals() else 'Universal Software Corp'}")
        dev.setStyleSheet("font-size: 13px; color: #64748B;")
        dev.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(dev)

        lic = QLabel("License: MIT Commercial License")
        lic.setStyleSheet("font-size: 12px; color: #64748B;")
        lic.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(lic)

        github_btn = QPushButton("🌐 Visit GitHub Repository")
        github_btn.setFixedWidth(220)
        card_layout.addWidget(github_btn, alignment=Qt.AlignCenter)

        layout.addWidget(card)
