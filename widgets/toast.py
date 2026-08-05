try:
    from PySide6.QtWidgets import QLabel, QGraphicsDropShadowEffect
    from PySide6.QtCore import QTimer, Qt
    from PySide6.QtGui import QColor
except ImportError:
    pass

class ToastNotification(QLabel if 'QLabel' in globals() else object):
    """Floating notification toast banner."""

    def __init__(self, message: str, parent=None, is_error=False):
        if 'QLabel' in globals():
            super().__init__(message, parent)
            bg = "#EF4444" if is_error else "#22C55E"
            self.setStyleSheet(f"""
                QLabel {{
                    background-color: {bg};
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                }}
            """)
            self.setWindowFlags(Qt.ToolTip | Qt.FramelessWindowHint)
            self.setAttribute(Qt.WA_ShowWithoutActivating)
            
            # Auto disappear after 3 seconds
            QTimer.singleShot(3000, self.deleteLater)
