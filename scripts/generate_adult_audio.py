"""
Generate English mp3 for 大人口语 (adult.html) local playback.

必须与 adult.html 中 seedLevels、buildGeneratedUnit、targetUnitCountByLevel 保持一致。
用法:
  pip install edge-tts
  python scripts/generate_adult_audio.py              # 仅生成缺失文件
  python scripts/generate_adult_audio.py --overwrite # 按当前课程全文覆盖（调课名后请用）
  # 文件名含课文哈希：L1_u1_l1_<8hex>.mp3，与屏显英文一一对应；旧式 L1_u1_l1.mp3 不再使用。
"""

import argparse
import asyncio
import re
from pathlib import Path

import edge_tts


def normalize_adult_en(s: str) -> str:
    """与 adult.html 中 normalizeAdultEn 一致，用于内容哈希与文件名。"""
    t = str(s or "").strip()
    t = re.sub(r"\s+", " ", t).lower()
    t = t.replace("\u2018", "'").replace("\u2019", "'").replace("\u2032", "'")
    t = t.replace("\u201c", '"').replace("\u201d", '"')
    return t


def adult_content_hash8(en: str) -> str:
    """与 adult.html 中 adultContentHash8 一致（UTF-8 字节上 djb2）。"""
    data = normalize_adult_en(en).encode("utf-8")
    h = 5381
    for b in data:
        h = ((h << 5) + h) ^ b
        h &= 0xFFFFFFFF
    return f"{h:08x}"


def adult_local_mp3_filename(level_id: str, unit_idx: int, line_idx: int, en: str) -> str:
    key = f"{level_id}_u{unit_idx}_l{line_idx}"
    return f"{key}_{adult_content_hash8(en)}.mp3"

# 与 adult.html 中 seedLevels 一致（仅保留 lines.en）
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
            {
                "lines": [
                    {"en": "May I see the menu, please?"},
                    {"en": "I am allergic to peanuts."},
                    {"en": "Could we have the bill?"},
                    {"en": "The food was delicious."},
                ]
            },
            {
                "lines": [
                    {"en": "Excuse me, where is the nearest subway station?"},
                    {"en": "Is it far from here?"},
                    {"en": "Turn left at the traffic lights."},
                    {"en": "You can't miss it."},
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
            {
                "lines": [
                    {"en": "It looks like it will rain this afternoon."},
                    {"en": "I should bring an umbrella."},
                    {"en": "The traffic is heavier than usual."},
                    {"en": "Let us leave ten minutes earlier."},
                ]
            },
            {
                "lines": [
                    {"en": "I have been sleeping better lately."},
                    {"en": "I want to walk at least eight thousand steps."},
                    {"en": "Could you recommend a light exercise?"},
                    {"en": "I will start with short walks."},
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
            {
                "lines": [
                    {"en": "I prefer quiet cafes with natural light."},
                    {"en": "To be honest, I was not fully convinced."},
                    {"en": "I would rather keep things simple."},
                    {"en": "In my experience, consistency matters most."},
                    {"en": "What matters to me is clear communication."},
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
            {
                "lines": [
                    {"en": "I would like to book a table for two at seven."},
                    {"en": "Do you have a table near the window?"},
                    {"en": "Is there a vegetarian option on the menu?"},
                    {"en": "We may arrive ten minutes late."},
                ]
            },
            {
                "lines": [
                    {"en": "I would like to return this item."},
                    {"en": "Here is my order number and receipt."},
                    {"en": "Could you process a refund to my card?"},
                    {"en": "I am satisfied with your quick response."},
                ]
            },
        ],
    },
]

TARGET_UNIT_COUNT = {"L1": 26, "L2": 26, "L3": 20, "L4": 20}


def build_generated_unit(level_id: str, index: int) -> dict:
    """与 adult.html 中 buildGeneratedUnit 一致；扩展课每课四句/五句英文互不重复。"""
    if level_id == "L1":
        scenes = [
            ("便利店", "Convenience Store", "water", "矿泉水"),
            ("面包店", "Bakery", "bread", "面包"),
            ("药店", "Pharmacy", "medicine", "药"),
            ("地铁站", "Subway", "ticket", "车票"),
            ("餐厅", "Restaurant", "noodles", "面条"),
            ("停车场", "Parking", "car", "车"),
            ("机场", "Airport", "boarding gate", "登机口"),
            ("咖啡馆", "Cafe", "sandwich", "三明治"),
            ("公园", "Park", "map", "地图"),
            ("商场", "Mall", "restroom", "洗手间"),
            ("书店", "Bookstore", "book", "书"),
            ("酒店前台", "Hotel Desk", "room key", "房卡"),
        ]
        scene = scenes[index % len(scenes)]
        w = scene[2]
        cycle = index // len(scenes)
        v = (index + cycle) % 6
        ask_en = [
            f"Excuse me, where is the {w}?",
            f"Excuse me, could you tell me where the {w} is?",
            f"Sorry, where can I find the {w}?",
            f"Hi, is the {w} around here?",
            f"Could you point me to the {w}?",
            f"Do you know where I can get the {w}?",
        ]
        want_en = [
            f"I would like one {w}, please.",
            f"I'll take one {w}, please.",
            f"Could I get one {w}, please?",
            f"I'd like to buy a {w}, please.",
            f"Can I have one {w}, please?",
            f"I need one {w}, please.",
        ]
        pay_en = [
            "Can I pay by card?",
            "Do you take cards here?",
            "Is contactless payment okay?",
            "Can I use mobile pay?",
            "Do you accept credit cards?",
            "May I pay with my phone?",
        ]
        bye_en = [
            "Thank you, have a nice day.",
            "Thanks for your help.",
            "I appreciate it. Goodbye.",
            "Thank you so much.",
            "Thanks, take care.",
            "Many thanks, see you.",
        ]
        return {
            "lines": [
                {"en": ask_en[v]},
                {"en": want_en[(v + 1) % 6]},
                {"en": pay_en[(v + 2) % 6]},
                {"en": bye_en[(v + 3) % 6]},
            ]
        }

    if level_id == "L2":
        topics = [
            ("通勤安排", "Commute Plan", "bus", "公交车", "office", "公司"),
            ("电话沟通", "Phone Call", "call", "电话", "meeting", "会议"),
            ("家庭计划", "Family Plan", "dinner", "晚饭", "home", "家里"),
            ("健身运动", "Workout", "gym", "健身房", "tonight", "今晚"),
            ("医院挂号", "Clinic Visit", "appointment", "预约", "doctor", "医生"),
            ("网购售后", "Online Shopping", "order", "订单", "refund", "退款"),
            ("同事协作", "Work Collaboration", "task", "任务", "deadline", "截止时间"),
            ("周末安排", "Weekend Plan", "trip", "出行", "Sunday", "周日"),
            ("孩子接送", "School Pickup", "school", "学校", "five", "五点"),
        ]
        t = topics[index % len(topics)]
        cycle = index // len(topics)
        v = (index + cycle) % 6
        sync_en = [
            "Can we talk about it after lunch?",
            "Could we sync briefly this afternoon?",
            "How about we talk tonight?",
            "Can we go over it tomorrow morning?",
            "Could we chat after work?",
            "Let us connect before the weekend.",
        ]
        tail_en = [
            "Please let me know if anything changes.",
            "Tell me if the plan shifts.",
            "Send me a message if the timing moves.",
            "Keep me posted if something changes.",
            "Let me know if you need to adjust it.",
            "Ping me if anything looks different.",
        ]
        return {
            "lines": [
                {"en": f"I need to confirm the {t[2]} plan."},
                {"en": sync_en[v]},
                {"en": f"I will send you an update before {t[4]}."},
                {"en": tail_en[(v + 2) % 6]},
            ]
        }

    if level_id == "L3":
        stories = [
            ("一次迟到经历", "A Late Arrival", "bus", "公交", "taxi", "出租车"),
            ("一次小成功", "A Small Win", "report", "报告", "team", "团队"),
            ("一次旅行准备", "Trip Preparation", "hotel", "酒店", "passport", "护照"),
            ("一次家庭活动", "Family Activity", "park", "公园", "picnic", "野餐"),
            ("一次学习复盘", "Study Review", "sentence", "句子", "practice", "练习"),
        ]
        s = stories[index % len(stories)]
        cycle = index // len(stories)
        v = (index + cycle) % 6
        l2_en = [
            "At first, I felt a little nervous.",
            "At first, I was unsure what to do.",
            "At first, it felt a bit overwhelming.",
            "At first, I hesitated for a moment.",
            "At first, I worried I might mess up.",
            "At first, I took a deep breath and paused.",
        ]
        l3_en = [
            "Then I tried another way and it worked.",
            "Then I adjusted my approach and it helped.",
            "Then I asked for help and things improved.",
            "Then I slowed down and thought it through.",
            "Then I made a small change and it paid off.",
            "Then I focused on one step at a time.",
        ]
        l4_en = [
            "This experience helped me trust myself more.",
            "This experience taught me to stay calm.",
            "This experience reminded me to prepare early.",
            "This experience made me more patient.",
            "This experience showed me I can adapt.",
            "This experience built my confidence slowly.",
        ]
        l5_en = [
            "Next time, I will prepare better and keep practicing.",
            "Next time, I will plan ahead and stay steady.",
            "Next time, I will ask earlier if I feel stuck.",
            "Next time, I will review the key phrases first.",
            "Next time, I will practice out loud more often.",
            "Next time, I will keep notes and repeat them.",
        ]
        return {
            "lines": [
                {"en": f"Yesterday I had to change my {s[2]} plan."},
                {"en": l2_en[v]},
                {"en": l3_en[(v + 1) % 6]},
                {"en": l4_en[(v + 2) % 6]},
                {"en": l5_en[(v + 3) % 6]},
            ]
        }

    dialogs = [
        ("机场值机", "Airport Check-in", "boarding pass", "登机牌"),
        ("酒店投诉", "Hotel Request", "air conditioner", "空调"),
        ("商务会议", "Business Meeting", "timeline", "时间线"),
        ("客户电话", "Client Call", "proposal", "方案"),
        ("售后沟通", "After-sales Talk", "replacement", "更换"),
        ("跨部门协作", "Cross-team Sync", "priority", "优先级"),
    ]
    d = dialogs[index % len(dialogs)]
    cycle = index // len(dialogs)
    v = (index + cycle) % 6
    help_en = [
        "Could you help me solve this issue today?",
        "Could you help me handle this today?",
        "Can you assist me with this today?",
        "Would you mind helping me with this today?",
        "I hope you can support me on this today.",
        "Can we resolve this together today?",
    ]
    thanks_en = [
        "I understand, and I appreciate your support.",
        "I understand, thank you for your patience.",
        "I understand, thanks for explaining clearly.",
        "I understand, I really appreciate your help.",
        "I understand, that makes sense to me.",
        "I understand, I am grateful for your time.",
    ]
    next_en = [
        "Let us agree on the next step right now.",
        "Let us lock the next step together now.",
        "Let us confirm the next action right now.",
        "Let us decide the follow-up right now.",
        "Let us outline the next move right now.",
        "Let us set a clear next step right now.",
    ]
    return {
        "lines": [
            {"en": f"I would like to confirm my {d[2]}."},
            {"en": help_en[v]},
            {"en": thanks_en[(v + 1) % 6]},
            {"en": next_en[(v + 2) % 6]},
        ]
    }


def expand_levels():
    levels = []
    for level in SEED_LEVELS:
        seed_n = len(level["units"])
        units = list(level["units"])
        target = TARGET_UNIT_COUNT.get(level["id"], len(units))
        while len(units) < target:
            gen_idx = len(units) - seed_n
            units.append(build_generated_unit(level["id"], gen_idx))
        levels.append({"id": level["id"], "units": units})
    return levels


async def synth_one(
    text: str,
    out_file: Path,
    voice: str,
    semaphore: asyncio.Semaphore,
    overwrite: bool,
    save_timeout: float,
):
    if out_file.exists() and not overwrite:
        return "skipped"
    tmp = out_file.with_suffix(out_file.suffix + ".part")
    try:
        async with semaphore:
            communicate = edge_tts.Communicate(text=text, voice=voice)
            await asyncio.wait_for(communicate.save(str(tmp)), timeout=save_timeout)
        if out_file.exists():
            try:
                out_file.unlink()
            except OSError:
                pass
        tmp.replace(out_file)
    except (TimeoutError, asyncio.TimeoutError, OSError):
        try:
            if tmp.exists():
                tmp.unlink()
        except OSError:
            pass
        return "failed"
    except Exception:
        try:
            if tmp.exists():
                tmp.unlink()
        except OSError:
            pass
        return "failed"
    return "created"


async def main():
    parser = argparse.ArgumentParser(description="Generate adult course English mp3 (matches adult.html).")
    parser.add_argument("--voice", default="en-US-EmmaNeural", help="edge-tts voice name")
    parser.add_argument("--out", default="audio/adult/en", help="output directory")
    parser.add_argument("--concurrency", type=int, default=2, help="parallel jobs (lower = fewer hangs)")
    parser.add_argument(
        "--save-timeout",
        type=float,
        default=90.0,
        help="seconds per file before giving up (avoids infinite wait on bad network)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Regenerate even if file exists (use after curriculum / unit order changes)",
    )
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
                fname = adult_local_mp3_filename(level_id, unit_idx, line_idx, line["en"])
                out_file = out_dir / fname
                jobs.append(
                    synth_one(
                        line["en"],
                        out_file,
                        args.voice,
                        sem,
                        args.overwrite,
                        args.save_timeout,
                    )
                )

    print(
        f"Queue {total} files (overwrite={args.overwrite}, concurrency={args.concurrency}, "
        f"timeout={args.save_timeout}s)...",
        flush=True,
    )
    results = await asyncio.gather(*jobs, return_exceptions=True)
    created = skipped = failed = 0
    for result in results:
        if isinstance(result, Exception):
            failed += 1
            print(result, flush=True)
        elif result == "created":
            created += 1
        elif result == "skipped":
            skipped += 1
        elif result == "failed":
            failed += 1
        else:
            failed += 1
    print(f"Done. created={created}, skipped={skipped}, failed={failed}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
