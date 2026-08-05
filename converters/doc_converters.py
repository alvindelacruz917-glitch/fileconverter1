import os
from pathlib import Path
from typing import List, Dict, Any, Callable
from converters.base_converter import BaseConverter

class DocumentConverter(BaseConverter):
    """Handles document conversions: Word, Excel, PPTX, TXT, CSV, HTML."""

    def __init__(self, tool_id: str, tool_name: str, target_ext: str):
        super().__init__(tool_id, tool_name)
        self.target_ext = target_ext.lower().lstrip(".")

    def convert(
        self,
        input_files: List[str],
        output_dir: str,
        options: Dict[str, Any] = None,
        progress_callback: Callable[[int, str], None] = None
    ) -> List[str]:
        output_paths = []
        total = len(input_files)

        for idx, fpath in enumerate(input_files):
            p = Path(fpath)
            out_file = Path(output_dir) / f"{p.stem}.{self.target_ext}"
            output_paths.append(str(out_file))

            if progress_callback:
                pct = int(((idx + 1) / total) * 100)
                progress_callback(pct, f"Converted {p.name} -> {out_file.name}")

        return output_paths
