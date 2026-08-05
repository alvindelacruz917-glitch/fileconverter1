try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton, QTableWidget, QTableWidgetItem, QHeaderView, QFrame
    from PySide6.QtCore import Qt
    from history.history_manager import history_manager
except ImportError:
    pass

class HistoryPage(QWidget if 'QWidget' in globals() else object):
    """Conversion logs history page with search and clearing."""

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(16)

        header = QHBoxLayout()
        title = QLabel("Conversion History")
        title.setStyleSheet("font-size: 26px; font-weight: 800; color: #F8FAFC;")
        header.addWidget(title)
        header.addStretch()

        clear_btn = QPushButton("Clear History")
        clear_btn.setObjectName("secondaryBtn")
        if hasattr(clear_btn, "clicked"):
            clear_btn.clicked.connect(self._clear_history)
        header.addWidget(clear_btn)

        layout.addLayout(header)

        # Search bar
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Filter history records...")
        layout.addWidget(self.search_input)

        # Table
        self.table = QTableWidget()
        self.table.setColumnCount(5)
        self.table.setHorizontalHeaderLabels(["Timestamp", "Tool Name", "Output File", "Size", "Status"])
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.table.setStyleSheet("""
            QTableWidget {
                background-color: #1E293B;
                border: 1px solid #334155;
                border-radius: 12px;
                gridline-color: #334155;
            }
            QHeaderView::section {
                background-color: #0F172A;
                color: #94A3B8;
                padding: 10px;
                font-weight: bold;
                border: none;
            }
        """)
        layout.addWidget(self.table)
        self.refresh_table()

    def refresh_table(self):
        records = history_manager.get_all() if 'history_manager' in globals() else []
        self.table.setRowCount(len(records))
        for row, r in enumerate(records):
            self.table.setItem(row, 0, QTableWidgetItem(r.get("timestamp", "")))
            self.table.setItem(row, 1, QTableWidgetItem(r.get("tool_name", "")))
            self.table.setItem(row, 2, QTableWidgetItem(r.get("output_file", "")))
            self.table.setItem(row, 3, QTableWidgetItem(f"{r.get('size_mb', 0)} MB"))
            status_item = QTableWidgetItem(r.get("status", "Success"))
            status_item.setForeground(Qt.green)
            self.table.setItem(row, 4, status_item)

    def _clear_history(self):
        if 'history_manager' in globals():
            history_manager.clear()
            self.refresh_table()
