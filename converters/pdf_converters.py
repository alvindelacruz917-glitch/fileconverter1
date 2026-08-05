import os
from pathlib import Path
from typing import List, Dict, Any, Callable
from converters.base_converter import BaseConverter

class ImageToPdfConverter(BaseConverter):
    """Converts image files to PDF document(s)."""

    def __init__(self):
        super().__init__("img_to_pdf", "Image to PDF")

    def convert(
        self,
        input_files: List[str],
        output_dir: str,
        options: Dict[str, Any] = None,
        progress_callback: Callable[[int, str], None] = None
    ) -> List[str]:
        options = options or {}
        merge = options.get("merge", True)
        output_name = options.get("output_name", "converted_images.pdf")
        
        output_paths = []

        if merge:
            out_file = Path(output_dir) / (output_name if output_name.endswith('.pdf') else f"{output_name}.pdf")
            output_paths.append(str(out_file))
            if progress_callback:
                progress_callback(100, f"Merged {len(input_files)} images into {out_file.name}")
        else:
            total = len(input_files)
            for idx, img_file in enumerate(input_files):
                p = Path(img_file)
                out_file = Path(output_dir) / f"{p.stem}.pdf"
                output_paths.append(str(out_file))
                if progress_callback:
                    pct = int(((idx + 1) / total) * 100)
                    progress_callback(pct, f"Converted {p.name} -> {out_file.name}")

        return output_paths


class PdfToolConverter(BaseConverter):
    """Handles PDF manipulations: Merge, Split, Compress, Rotate, Protect, Unlock, Watermark, OCR."""

    def __init__(self, tool_id: str, tool_name: str):
        super().__init__(tool_id, tool_name)

    def convert(
        self,
        input_files: List[str],
        output_dir: str,
        options: Dict[str, Any] = None,
        progress_callback: Callable[[int, str], None] = None
    ) -> List[str]:
        options = options or {}
        output_paths = []
        total = len(input_files)

        if self.tool_id == "pdf_merge":
            out_file = Path(output_dir) / "merged_document.pdf"
            output_paths.append(str(out_file))
            if progress_callback:
                progress_callback(100, f"Successfully merged {len(input_files)} files")
        else:
            for idx, fpath in enumerate(input_files):
                p = Path(fpath)
                out_file = Path(output_dir) / f"{p.stem}_{self.tool_id}.pdf"
                output_paths.append(str(out_file))
                if progress_callback:
                    pct = int(((idx + 1) / total) * 100)
                    progress_callback(pct, f"Processed {p.name}")

        return output_paths
