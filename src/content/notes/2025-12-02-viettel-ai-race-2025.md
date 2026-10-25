---
title: "The GPU platform behind the Viettel AI Race 2025 final"
date: 2025-12-02
---

Viettel AI Race 2025 was the first edition of Viettel's AI competition for students, engineers and AI enthusiasts. In its first month it drew 1,285 contestants in 666 teams, across three real problems: cutting the energy use of a 5G network, processing large volumes of technical documents, and 3D positioning in logistics. The top two teams on each problem went to the final in Hanoi: one long hackathon day, with every team solving all three.

![Speaking on camera at the Viettel AI Race 2025 hackathon day](/notes/2025-12-02-ai-race-interview.jpg)

As tech lead of the AI Platform, I'm responsible for the GPU platform the final ran on. Six teams worked at once, each with two L40 GPUs, so conditions were the same for everyone. The goal was zero setup: each team opened a notebook with the libraries and models for its problems already in place, an LLM playground on GPT-OSS-120B for lookups, and Label Studio for labelling data. No driver conflicts, no broken environments. Handing out, reclaiming and resetting environments all happened centrally on the platform, so the organisers didn't have to fix laptops and the teams could stay on the problems.

![The hackathon room at the Viettel Academy](/notes/2025-12-02-ai-race-hackathon-room.jpg)

They used it hard. From 9:00 until after 20:00 many GPUs sat at 100%, and VRAM reached 44.4 GiB of 48. At the peak, 10 of the 12 GPUs were busy at the same time with 37 processes, and the platform stayed stable throughout.

![Working through a problem with one of the teams](/notes/2025-12-02-ai-race-with-a-team.jpg)

![Guiding the teams during the hackathon](/notes/2025-12-02-ai-race-guiding-teams.jpg)

The same platform later carried Viettel AI Race 2026, and the [Vietnam AI Open Hackathon 2026](https://vn.linkedin.com/posts/ntheanh201_vietnamaiopenhackathon2026-viettel-nvidia-activity-7471947616910495744--35R) with NVIDIA, where the cluster passed all 14 checks in NVIDIA's Cluster Readiness Checklist.

![At the Viettel AI Race 2025 hackathon day](/notes/2025-12-02-ai-race-portrait.jpg)
