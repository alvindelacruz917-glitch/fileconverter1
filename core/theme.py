import os
from pathlib import Path

DARK_QSS = """
QMainWindow, QDialog {
    background-color: #0F172A;
    color: #F8FAFC;
}

QWidget {
    font-family: 'Segoe UI', 'Inter', sans-serif;
    color: #F8FAFC;
}

QFrame#card {
    background-color: #1E293B;
    border-radius: 18px;
    border: 1px solid #334155;
}

QFrame#card:hover {
    border: 1px solid #2563EB;
}

QPushButton {
    background-color: #2563EB;
    color: #FFFFFF;
    border-radius: 10px;
    padding: 10px 20px;
    font-weight: 600;
    border: none;
}

QPushButton:hover {
    background-color: #1D4ED8;
}

QPushButton#secondaryBtn {
    background-color: #334155;
    color: #F8FAFC;
}

QPushButton#secondaryBtn:hover {
    background-color: #475569;
}

QLineEdit, QComboBox, QSpinBox {
    background-color: #1E293B;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 8px 12px;
    color: #F8FAFC;
}

QLineEdit:focus, QComboBox:focus {
    border: 1px solid #2563EB;
}

QProgressBar {
    background-color: #1E293B;
    border-radius: 8px;
    text-align: center;
    color: #FFFFFF;
}

QProgressBar::chunk {
    background-color: #2563EB;
    border-radius: 8px;
}
"""

LIGHT_QSS = """
QMainWindow, QDialog {
    background-color: #F8FAFC;
    color: #0F172A;
}

QWidget {
    font-family: 'Segoe UI', 'Inter', sans-serif;
    color: #0F172A;
}

QFrame#card {
    background-color: #FFFFFF;
    border-radius: 18px;
    border: 1px solid #E2E8F0;
}

QFrame#card:hover {
    border: 1px solid #2563EB;
}

QPushButton {
    background-color: #2563EB;
    color: #FFFFFF;
    border-radius: 10px;
    padding: 10px 20px;
    font-weight: 600;
    border: none;
}

QPushButton:hover {
    background-color: #1D4ED8;
}

QPushButton#secondaryBtn {
    background-color: #E2E8F0;
    color: #0F172A;
}

QPushButton#secondaryBtn:hover {
    background-color: #CBD5E1;
}

QLineEdit, QComboBox, QSpinBox {
    background-color: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 10px;
    padding: 8px 12px;
    color: #0F172A;
}

QLineEdit:focus, QComboBox:focus {
    border: 1px solid #2563EB;
}

QProgressBar {
    background-color: #E2E8F0;
    border-radius: 8px;
    text-align: center;
    color: #0F172A;
}

QProgressBar::chunk {
    background-color: #2563EB;
    border-radius: 8px;
}
"""

def get_stylesheet(theme_mode="dark"):
    return DARK_QSS if theme_mode == "dark" else LIGHT_QSS
