import time
from typing import List, Dict, Any

try:
    from PySide6.QtCore import QThread, Signal
except ImportError:
    # Dummy placeholder for non-PySide test envs
    class QThread:
        pass
    def Signal(*args, **kwargs):
        return None

class ConversionWorker(QThread):
    """Background worker thread to perform conversions without blocking the UI."""

    progress = Signal(int, str)
    finished = Signal(list)
    error = Signal(str)

    def __init__(self, converter, input_files: List[str], output_dir: str, options: Dict[str, Any] = None):
        super().__init__()
        self.converter = converter
        self.input_files = input_files
        self.output_dir = output_dir
        self.options = options or {}
        self._is_cancelled = False

    def cancel(self):
        self._is_cancelled = True

    def run(self):
        try:
            def on_progress(pct, msg):
                if self._is_cancelled:
                    raise Exception("Conversion cancelled by user")
                self.progress.emit(pct, msg)

            outputs = self.converter.convert(
                input_files=self.input_files,
                output_dir=self.output_dir,
                options=self.options,
                progress_callback=on_progress
            )
            self.finished.emit(outputs)
        except Exception as e:
            self.error.emit(str(e))
