import argparse
import asyncio
import re
from pathlib import Path

import edge_tts


def slugify(text: str) -> str:
  return re.sub(r"^_+|_+$", "", re.sub(r"[^a-z0-9]+", "_", text.lower().strip()))


def extract_english_terms(app_js: Path) -> list[str]:
  content = app_js.read_text(encoding="utf-8")
  start = content.find("const categories =")
  end = content.find("const homeView")
  if start < 0 or end < 0:
    raise RuntimeError("Unable to locate categories block in app.js")
  section = content[start:end]
  terms = re.findall(r'en:\s*"([^"]+)"', section)
  uniq = []
  seen = set()
  for term in terms:
    key = slugify(term)
    if key and key not in seen:
      seen.add(key)
      uniq.append(term)
  return uniq


async def synthesize_one(text: str, out_file: Path, voice: str, semaphore: asyncio.Semaphore):
  if out_file.exists():
    return False
  async with semaphore:
    communicate = edge_tts.Communicate(text=text, voice=voice)
    await communicate.save(str(out_file))
  return True


async def main():
  parser = argparse.ArgumentParser(description="Generate local audio for child English words.")
  parser.add_argument("--app", default="app.js", help="path to app.js")
  parser.add_argument("--out", default="audio/children/en", help="output folder")
  parser.add_argument("--voice", default="en-US-EmmaNeural", help="edge-tts voice")
  parser.add_argument("--concurrency", type=int, default=4, help="parallel jobs")
  args = parser.parse_args()

  app_path = Path(args.app)
  out_dir = Path(args.out)
  out_dir.mkdir(parents=True, exist_ok=True)

  terms = extract_english_terms(app_path)
  semaphore = asyncio.Semaphore(max(1, args.concurrency))
  jobs = []
  for term in terms:
    key = slugify(term)
    out_file = out_dir / f"{key}.mp3"
    jobs.append(synthesize_one(term, out_file, args.voice, semaphore))

  print(f"Generating {len(jobs)} child audio files...")
  results = await asyncio.gather(*jobs, return_exceptions=True)
  created = 0
  failed = 0
  for result in results:
    if isinstance(result, Exception):
      failed += 1
    elif result:
      created += 1
  print(f"Done. created={created}, failed={failed}, existing={len(jobs) - created - failed}")


if __name__ == "__main__":
  asyncio.run(main())
