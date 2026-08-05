try:
    from PySide6.QtWidgets import QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QStackedWidget
    from PySide6.QtCore import Qt
    from widgets.sidebar import Sidebar
    from widgets.top_bar import TopBar
    from pages.home_page import HomePage
    from pages.pdf_tools_page import PdfToolsPage
    from pages.image_tools_page import ImageToolsPage
    from pages.doc_tools_page import DocToolsPage
    from pages.converter_page import ConverterPage
    from pages.image_to_pdf_page import ImageToPdfPage
    from pages.history_page import HistoryPage
    from pages.settings_page import SettingsPage
    from pages.about_page import AboutPage
    from core.theme import get_stylesheet
    from core.config import config_manager
except ImportError:
    pass

class MainWindow(QMainWindow if 'QMainWindow' in globals() else object):
    """Main Application Window housing sidebar, top navigation, stacked views."""

    def __init__(self):
        if 'QMainWindow' in globals():
            super().__init__()
            self.setWindowTitle("Universal File Converter - Pro Studio")
            w = config_manager.get("window_width", 1280)
            h = config_manager.get("window_height", 850)
            self.resize(w, h)
            self.init_ui()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Top Navigation
        self.top_bar = TopBar()
        main_layout.addWidget(self.top_bar)

        # Body Layout: Sidebar + Stacked Widget
        body = QWidget()
        body_layout = QHBoxLayout(body)
        body_layout.setContentsMargins(0, 0, 0, 0)
        body_layout.setSpacing(0)

        self.sidebar = Sidebar()
        body_layout.addWidget(self.sidebar)

        self.stacked_widget = QStackedWidget()
        body_layout.addWidget(self.stacked_widget)

        main_layout.addWidget(body)

        # Initialize View Pages
        self.home_page = HomePage()
        self.pdf_page = PdfToolsPage()
        self.image_page = ImageToolsPage()
        self.doc_page = DocToolsPage()
        self.generic_converter = ConverterPage()
        self.img_to_pdf_studio = ImageToPdfPage()
        self.history_page = HistoryPage()
        self.settings_page = SettingsPage()
        self.about_page = AboutPage()

        self.stacked_widget.addWidget(self.home_page)         # Index 0
        self.stacked_widget.addWidget(self.pdf_page)          # Index 1
        self.stacked_widget.addWidget(self.image_page)        # Index 2
        self.stacked_widget.addWidget(self.doc_page)          # Index 3
        self.stacked_widget.addWidget(self.generic_converter)  # Index 4
        self.stacked_widget.addWidget(self.img_to_pdf_studio)  # Index 5
        self.stacked_widget.addWidget(self.history_page)       # Index 6
        self.stacked_widget.addWidget(self.settings_page)      # Index 7
        self.stacked_widget.addWidget(self.about_page)         # Index 8

        # Apply initial stylesheet
        theme = config_manager.get("theme", "dark")
        self.setStyleSheet(get_stylesheet(theme))
