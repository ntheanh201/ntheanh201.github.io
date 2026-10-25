---
title: "An l40-any overlay in AICR v0.21"
date: 2026-09-10
source: LinkedIn
sourceUrl: https://www.linkedin.com/feed/update/urn:li:activity:7503753588351877121/
---

Glad to have a small piece in [AICR v0.21](https://github.com/NVIDIA/aicr/releases/tag/v0.21.0): an `l40-any` accelerator overlay ([NVIDIA/aicr#2366](https://github.com/NVIDIA/aicr/pull/2366)).

![NVIDIA/aicr#2366, feat(recipes): add l40-any accelerator overlay](/notes/aicr-l40-any-pr.jpg)

L40 was a registered accelerator type in AICR's catalog with no overlay behind it, so `aicr snapshot` on a real L40 node would detect the hardware and then fail to resolve a recipe for it.

Worth pushing upstream when it hit on real hardware.

*Shared with Mark Chmarny's announcement: AICR v0.21 adds GB300 and Vera Rubin support, Kubernetes 1.37 compatibility, major GPU Operator and Dynamo upgrades, and stronger API, validation and bundling guarantees on the way to v1.*
