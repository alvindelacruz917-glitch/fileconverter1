try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QComboBox, QCheckBox, QLineEdit, QPushButton, QFrame, QFileDialog
    from PySide6.QtCore import Signal
    from core.config import config_manager
except ImportError:
    pass

class SettingsPage(QWidget if 'QWidget' in globals() else object):
    """Preferences & settings configuration page."""

    theme_changed = Signal(str) if 'Signal' in globals() else None

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(20)

        title = QLabel("Application Settings")
        title.setStyleSheet("font-size: 26px; font-weight: 800; color: #F8FAFC;")
        layout.addWidget(title)

        card = QFrame()
        card.setObjectName("card")
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(24, 24, 24, 24)
        card_layout.setSpacing(16)

        # Theme selector
        theme_row = QHBoxLayout()
        theme_row.addWidget(QLabel("Appearance Theme:"))
        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["Dark", "Light"])
        theme_row.addWidget(self.theme_combo)
        theme_row.addStretch()
        card_layout.addLayout(theme_row)

        # Accent Color selector
        accent_row = QHBoxLayout()
        accent_row.addWidget(QLabel("Accent Color:"))
        self.accent_combo = QComboBox()
        self.accent_combo.addItems(["Blue (#2563EB)", "Purple (#7C3AED)", "Emerald (#10B981)", "Sky (#0EA5E9)"])
        accent_row.addWidget(self.accent_combo)
        accent_row.addStretch()
        card_layout.addLayout(accent_row)

        # Default Output Folder
        folder_row = QHBoxLayout()
        folder_row.addWidget(QLabel("Default Output Folder:"))
        self.folder_input = QLineEdit(config_manager.get("output_folder", ""))
        folder_row.addWidget(self.folder_input)
        browse_btn = QPushButton("Browse")
        browse_btn.setObjectName("secondaryBtn")
        folder_row.addWidget(browse_btn)
        card_layout.addLayout(folder_row)

        # Checkboxes
        self.chk_auto_open = QCheckBox("Automatically open output file after conversion")
        self.chk_auto_open.setChecked(config_manager.get("auto_open_output", True))
        card_layout.addWidget(self.chk_auto_open)

        self.chk_remember_folder = QCheckBox("Remember last used directory")
        self.chk_remember_folder.setChecked(config_manager.get("remember_last_folder", True))
        card_layout.addWidget(self.chk_remember_folder)

        self.chk_remember_win = QCheckBox("Remember window position and size")
        self.chk_remember_win.setChecked(config_manager.get("remember_window_size", True))
        card_layout.addWidget(self.chk_remember_win)

        self.chk_sounds = QCheckBox("Enable completion sound notifications")
        self.chk_sounds.setChecked(config_manager.get("sound_effects", True))
        card_layout.addWidget(self.chk_sounds)

        card_layout.addStretch()

        save_btn = QPushButton("Save Settings")
        save_btn.setFixedWidth(160)
        card_layout.addWidget(save_btn)

        layout.addWidget(card)
