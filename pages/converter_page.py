try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QProgressBar, QTextEdit, QFileDialog, QFrame
    from PySide6.QtCore import Signal, Qt
    from widgets.drop_zone import DropZone
    from widgets.file_item import FileItemWidget
except ImportError:
    pass

class ConverterPage(QWidget if 'QWidget' in globals() else object):
    """Generic tool page for batch processing files with logs, progress bar, output settings."""

    back_requested = Signal() if 'Signal' in globals() else None

    def __init__(self, tool_id: str = "pdf_to_word", tool_name: str = "PDF to Word", parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.tool_id = tool_id
            self.tool_name = tool_name
            self.files = []
            self.init_ui()

    def set_tool(self, tool_id: str, tool_name: str):
        self.tool_id = tool_id
        self.tool_name = tool_name
        if hasattr(self, "title_label"):
            self.title_label.setText(tool_name)

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(16)

        header = QHBoxLayout()
        back_btn = QPushButton("← Back to Tools")
        back_btn.setObjectName("secondaryBtn")
        if hasattr(back_btn, "clicked"):
            back_btn.clicked.connect(lambda: self.back_requested.emit() if self.back_requested else None)
        header.addWidget(back_btn)

        self.title_label = QLabel(self.tool_name)
        self.title_label.setStyleSheet("font-size: 24px; font-weight: 800; color: #F8FAFC;")
        header.addWidget(self.title_label)
        header.addStretch()

        clear_btn = QPushButton("Clear All")
        clear_btn.setObjectName("secondaryBtn")
        header.addWidget(clear_btn)

        layout.addLayout(header)

        # Drop Zone
        self.drop_zone = DropZone(subtitle="Select or drop files to convert")
        layout.addWidget(self.drop_zone)

        # Output Folder selector
        folder_frame = QFrame()
        folder_frame.setObjectName("card")
        folder_layout = QHBoxLayout(folder_frame)
        folder_layout.setContentsMargins(16, 12, 16, 12)

        folder_label = QLabel("Output Folder:")
        folder_label.setStyleSheet("font-weight: 600;")
        folder_layout.addWidget(folder_label)

        self.folder_path_label = QLabel("~/Downloads/ConvertedFiles")
        self.folder_path_label.setStyleSheet("color: #2563EB; font-weight: 600;")
        folder_layout.addWidget(self.folder_path_label)

        folder_layout.addStretch()

        browse_btn = QPushButton("Browse Folder")
        browse_btn.setObjectName("secondaryBtn")
        folder_layout.addWidget(browse_btn)

        layout.addWidget(folder_frame)

        # Progress & Log
        self.progress_bar = QProgressBar()
        self.progress_bar.setValue(0)
        layout.addWidget(self.progress_bar)

        self.log_output = QTextEdit()
        self.log_output.setReadOnly(True)
        self.log_output.setMaximumHeight(100)
        self.log_output.setPlaceholderText("Conversion log output will appear here...")
        layout.addWidget(self.log_output)

        # Action bar
        action_layout = QHBoxLayout()
        action_layout.addStretch()

        cancel_btn = QPushButton("Cancel")
        cancel_btn.setObjectName("secondaryBtn")
        action_layout.addWidget(cancel_btn)

        self.convert_btn = QPushButton("⚡ Start Conversion")
        self.convert_btn.setMinimumWidth(200)
        self.convert_btn.setStyleSheet("font-size: 15px; padding: 12px 24px;")
        action_layout.addWidget(self.convert_btn)

        layout.addLayout(action_layout)
