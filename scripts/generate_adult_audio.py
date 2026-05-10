import argparse
import asyncio
from pathlib import Path

import edge_tts


SEED_LEVELS = [
    {
        "id": "L1",
        "units": [
            {
                "lines": [
                    {"en": "Hi, how are you today?"},
                    {"en": "I am fine, thank you."},
                    {"en": "Nice to meet you."},
                    {"en": "See you later."},
                ]
            },
            {
                "lines": [
                    {"en": "I would like a cup of coffee."},
                    {"en": "Can I have less sugar?"},
                    {"en": "For here or to go?"},
                    {"en": "To go, please."},
                ]
            },
            {
                "lines": [
                    {"en": "Could you take me to the station?"},
                    {"en": "How long will it take?"},
                    {"en": "Please stop here."},
                    {"en": "Keep the change."},
                ]
            },
        ],
    },
    {
        "id": "L2",
        "units": [
            {
                "lines": [
                    {"en": "Where can I find milk?"},
                    {"en": "Do you have a cheaper one?"},
                    {"en": "I will take this one."},
                    {"en": "Can I pay by card?"},
                ]
            },
            {
                "lines": [
                    {"en": "I need to finish this today."},
                    {"en": "Can we talk after lunch?"},
                    {"en": "I will call you tonight."},
                    {"en": "Let us make a simple plan."},
                ]
            },
            {
                "lines": [
                    {"en": "I will be home before eight."},
                    {"en": "Please wait for me."},
                    {"en": "Let us eat together tonight."},
                    {"en": "Thank you for your help."},
                ]
            },
        ],
    },
    {
        "id": "L3",
        "units": [
            {
                "lines": [
                    {"en": "Today was busy but meaningful."},
                    {"en": "I solved one difficult problem."},
                    {"en": "I learned a new phrase at lunch."},
                    {"en": "I feel more confident now."},
                    {"en": "Tomorrow I will practice again."},
                ]
            },
            {
                "lines": [
                    {"en": "This morning I missed my bus."},
                    {"en": "I felt nervous for a minute."},
                    {"en": "Then I took a taxi and arrived on time."},
                    {"en": "My teammate smiled and helped me."},
                    {"en": "In the end, everything was fine."},
                ]
            },
        ],
    },
    {
        "id": "L4",
        "units": [
            {
                "lines": [
                    {"en": "I have a booking under Chen."},
                    {"en": "Could I check in early?"},
                    {"en": "Is breakfast included?"},
                    {"en": "Could you call me a taxi at seven?"},
                ]
            },
            {
                "lines": [
                    {"en": "Let me share a quick update."},
                    {"en": "We are on track for this week."},
                    {"en": "The main risk is delivery time."},
                    {"en": "Could we confirm the next step?"},
                ]
            },
        ],
    },
]

TARGET_UNIT_COUNT = {"L1": 18, "L2": 18, "L3": 14, "L4": 14}


def build_generated_unit(level_id: str, index: int) -> dict:
    if level_id == "L1":
        scenes = [
            ("water", "矿泉水"),
            ("bread", "面包"),
            ("medicine", "药"),
            ("ticket", "车票"),
            ("noodles", "面条"),
            ("car", "车"),
            ("boarding gate", "登机口"),
            ("sandwich", "三明治"),
            ("map", "地图"),
            ("restroom", "洗手间"),
            ("book", "书"),
            ("room key", "房卡"),
        ]
        item = scenes[index % len(scenes)]
        return {
            "lines": [
                {"en": f"Excuse me, where is the {item[0]}?"},
                {"en": f"I would like one {item[0]}, please."},
                {"en": "Can I pay by card?"},
                {"en": "Thank you, have a nice day."},
            ]
        }

    if level_id == "L2":
        topics = [
            ("bus", "公交车", "office", "公司"),
            ("call", "电话", "meeting", "会议"),
            ("dinner", "晚饭", "home", "家里"),
            ("gym", "健身房", "tonight", "今晚"),
            ("appointment", "预约", "doctor", "医生"),
            ("order", "订单", "refund", "退款"),
            ("task", "任务", "deadline", "截止时间"),
            ("trip", "出行", "Sunday", "周日"),
            ("school", "学校", "five", "五点"),
        ]
        item = topics[index % len(topics)]
        return {
            "lines": [
                {"en": f"I need to confirm the {item[0]} plan."},
                {"en": "Can we talk about it after lunch?"},
                {"en": f"I will send you an update before {item[2]}."},
                {"en": "Please let me know if anything changes."},
            ]
        }

    if level_id == "L3":
        stories = [
            ("bus", "公交"),
            ("report", "报告"),
            ("hotel", "酒店"),
            ("park", "公园"),
            ("sentence", "句子"),
        ]
        item = stories[index % len(stories)]
        return {
            "lines": [
                {"en": f"Yesterday I had to change my {item[0]} plan."},
                {"en": "At first, I felt a little nervous."},
                {"en": "Then I tried another way and it worked."},
                {"en": "This experience helped me trust myself more."},
                {"en": "Next time, I will prepare better and keep practicing."},
            ]
        }

    dialogs = [
        ("boarding pass", "登机牌"),
        ("air conditioner", "空调"),
        ("timeline", "时间线"),
        ("proposal", "方案"),
        ("replacement", "更换"),
        ("priority", "优先级"),
    ]
    item = dialogs[index % len(dialogs)]
    return {
        "lines": [
            {"en": f"I would like to confirm my {item[0]}."},
            {"en": "Could you help me solve this issue today?"},
            {"en": "I understand, and I appreciate your support."},
            {"en": "Let us agree on the next step right now."},
        ]
    }


def expand_levels():
    levels = []
    for level in SEED_LEVELS:
        units = list(level["units"])
        target = TARGET_UNIT_COUNT.get(level["id"], len(units))
        while len(units) < target:
            gen_idx = len(units) - len(level["units"])
            units.append(build_generated_unit(level["id"], gen_idx))
        levels.append({"id": level["id"], "units": units})
    return levels


async def synth_one(text: str, out_file: Path, voice: str, semaphore: asyncio.Semaphore):
    if out_file.exists():
        return False
    async with semaphore:
        communicate = edge_tts.Communicate(text=text, voice=voice)
        await communicate.save(str(out_file))
    return True


async def main():
    parser = argparse.ArgumentParser(description="Generate adult course English mp3 files.")
    parser.add_argument("--voice", default="en-US-EmmaNeural", help="edge-tts voice name")
    parser.add_argument("--out", default="audio/adult/en", help="output directory")
    parser.add_argument("--concurrency", type=int, default=4, help="parallel jobs")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    levels = expand_levels()

    jobs = []
    sem = asyncio.Semaphore(max(1, args.concurrency))
    total = 0
    for level in levels:
        level_id = level["id"]
        for unit_idx, unit in enumerate(level["units"], start=1):
            for line_idx, line in enumerate(unit["lines"], start=1):
                total += 1
                key = f"{level_id}_u{unit_idx}_l{line_idx}"
                out_file = out_dir / f"{key}.mp3"
                jobs.append(synth_one(line["en"], out_file, args.voice, sem))

    print(f"Generating {total} English audio files...")
    results = await asyncio.gather(*jobs, return_exceptions=True)
    created = 0
    failed = 0
    for result in results:
        if isinstance(result, Exception):
            failed += 1
        elif result:
            created += 1
    print(f"Done. created={created}, failed={failed}, existing={total - created - failed}")


if __name__ == "__main__":
    asyncio.run(main())
