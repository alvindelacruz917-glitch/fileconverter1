try:
    from PySide6.QtWidgets import QFrame, QVBoxLayout, QLabel
    from PySide6.QtCore import Signal, Qt
except ImportError:
    pass

class ToolCard(QFrame if 'QFrame' in globals() else object):
    """Popular tool item card with icon, title, description, rounded corners, hover effect."""

    clicked = Signal(str) if 'Signal' in globals() else None

    def __init__(self, tool_id: str, icon_str: str, name: str, description: str, parent=None):
        if 'QFrame' in globals():
            super().__init__(parent)
            self.tool_id = tool_id
            self.name = name
            self.description = description
            self.icon_str = icon_str
            self.init_ui()

    def init_ui(self):
        self.setObjectName("card")
        self.setCursor(Qt.PointingHandCursor)
        self.setMinimumHeight(140)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(18, 18, 18, 18)
        layout.setSpacing(8)

        icon_label = QLabel(self.icon_str)
        icon_label.setStyleSheet("font-size: 28px;")
        layout.addWidget(icon_label)

        title = QLabel(self.name)
        title.setStyleSheet("font-size: 15px; font-weight: bold; color: #F8FAFC;")
        layout.addWidget(title)

        desc = QLabel(self.description)
        desc.setWordWrap(True)
        desc.setStyleSheet("font-size: 12px; color: #94A3B8; line-height: 1.4;")
        layout.addWidget(desc)
        layout.addStretch()

    def mousePressEvent(self, event):
        if hasattr(self, "clicked") and self.clicked:
            self.clicked.emit(self.tool_id)
