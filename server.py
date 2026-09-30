"""Local web server and private proxy for food-photo recognition."""

from __future__ import annotations

import base64
import cgi
import json
import os
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).resolve().parent
MAX_IMAGE_BYTES = 8 * 1024 * 1024
VISION_MODEL = os.environ.get("OPENAI_VISION_MODEL", "gpt-4.1-mini")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_PUBLISHABLE_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")

NUTRITION_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "meal_name": {"type": "string"},
        "estimated_grams": {"type": "number"},
        "calories": {"type": "number"},
        "protein": {"type": "number"},
        "carbs": {"type": "number"},
        "fat": {"type": "number"},
        "confidence": {"type": "number"},
        "items": {"type": "array", "items": {"type": "object", "additionalProperties": False, "properties": {"name": {"type": "string"}, "estimated_grams": {"type": "number"}}, "required": ["name", "estimated_grams"]}},
        "note": {"type": "string"},
    },
    "required": ["meal_name", "estimated_grams", "calories", "protein", "carbs", "fat", "confidence", "items", "note"],
}

INSTRUCTIONS = """You estimate nutrition from a food photo for a personal diet tracker.
Identify visible foods, estimate their edible weight in grams, then estimate the total meal calories,
protein, carbohydrates and fat. Use Chinese food names. Do not claim precision: account for hidden oil,
sauces, cooking method, and missing scale reference in the note. Return values for the entire pictured
portion, not values per 100g. If the image is not clearly food, say so in note and use 0 values.
Confidence must be between 0 and 1."""


class AppHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webmanifest": "application/manifest+json",
        ".svg": "image/svg+xml",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        if self.path != "/api/recognize-food":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        self.recognize_food()

    def do_GET(self):
        if self.path == "/api/config":
            self.respond_json(
                HTTPStatus.OK,
                {
                    "supabaseUrl": SUPABASE_URL,
                    "supabasePublishableKey": SUPABASE_PUBLISHABLE_KEY,
                    "cloudSyncAvailable": bool(SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY),
                    "visionAvailable": bool(os.environ.get("OPENAI_API_KEY")),
                },
            )
            return
        super().do_GET()

    def recognize_food(self):
        if not os.environ.get("OPENAI_API_KEY"):
            self.respond_json(HTTPStatus.SERVICE_UNAVAILABLE, {"error": "视觉识别尚未配置。请在启动服务前设置 OPENAI_API_KEY。"})
            return
        content_type = self.headers.get("Content-Type", "")
        if not content_type.startswith("multipart/form-data"):
            self.respond_json(HTTPStatus.BAD_REQUEST, {"error": "请上传一张图片。"})
            return
        try:
            form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": content_type})
            image_field = form["image"]
            image_bytes = image_field.file.read(MAX_IMAGE_BYTES + 1)
            if not image_bytes or len(image_bytes) > MAX_IMAGE_BYTES:
                raise ValueError("图片为空或超过 8MB 限制")
            mime_type = image_field.type or "image/jpeg"
            if not mime_type.startswith("image/"):
                raise ValueError("只支持图片文件")
        except (KeyError, ValueError, TypeError) as error:
            self.respond_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        image_url = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode('ascii')}"
        try:
            response = OpenAI().responses.create(
                model=VISION_MODEL,
                instructions=INSTRUCTIONS,
                input=[{"role": "user", "content": [{"type": "input_text", "text": "Analyze this meal photo and return the requested nutrition estimate."}, {"type": "input_image", "image_url": image_url, "detail": "high"}]}],
                text={"format": {"type": "json_schema", "name": "food_photo_estimate", "strict": True, "schema": NUTRITION_SCHEMA}},
            )
            self.respond_json(HTTPStatus.OK, json.loads(response.output_text))
        except Exception as error:
            self.respond_json(HTTPStatus.BAD_GATEWAY, {"error": f"视觉识别暂时不可用：{error}"})

    def respond_json(self, status: HTTPStatus, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    print(f"Serving {ROOT} at http://localhost:{port}")
    ThreadingHTTPServer(("", port), AppHandler).serve_forever()
