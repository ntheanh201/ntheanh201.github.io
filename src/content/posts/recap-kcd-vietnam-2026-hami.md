---
title: "Recap KCD & OpenInfra Days Vietnam 2026: From Project to Production, HAMi and Viettel Cloud"
subtitle: "3.4× more work per GPU from cards that sat mostly empty, on a certified Kubernetes AI platform. What we measured, what it took, and how to pick the jobs that benefit."
description: "Recap of my talk with Reza Jelveh (Dynamia AI, makers of HAMi) at KCD & OpenInfra Days Vietnam 2026, Sheraton Hanoi, 25 July 2026: 3.4× more work per GPU with HAMi on a certified Kubernetes AI platform, what it took, and which jobs benefit."
date: 2026-07-25
tags: ["talk", "hami", "gpu-sharing", "kubernetes", "keda"]
---

*[Đọc bản tiếng Việt](/articles/recap-kcd-vietnam-2026-hami-vi.html).*

![Cover slide of the talk](/img/talks/2026-07-25/slide-1.jpg)

Our GPUs were mostly empty while their pods held the whole card. With HAMi, one H200 did 3.4× the work
at the same latency. Getting there took real operations work, and the gain comes from choosing the right
jobs to share a card. That was my half of the talk Reza Jelveh and I gave at KCD & OpenInfra Days Vietnam
2026, on 25 July at the Sheraton Hanoi.

The pairing is what made the session work. Reza is a Solution Architect at Dynamia AI, the company
behind [HAMi](https://github.com/Project-HAMi/HAMi), so he brought the upstream view: how the project
works and why. I brought the downstream view from our GPU clusters: what we measured, what broke, and
what we learned.

![Reza and me on stage at KCD & OpenInfra Days Vietnam 2026](/img/talks/2026-07-25/photo-on-stage.jpg)

## Reza's half: why GPUs need slicing at all

Kubernetes allocates GPUs atomically. A pod asks for `nvidia.com/gpu: 1` and gets the whole device, so a
job that needs 1 GB holds an 80 GB card, and over-provisioning becomes the default. DRA gives Kubernetes
a structured way to describe and request devices, but describing a slice is not the same as enforcing
it.

HAMi, a CNCF Incubating project, fills that gap. It intercepts CUDA calls inside the container
(`libvgpu`, loaded with `LD_PRELOAD`) so a pod gets a hard memory limit and a share of compute on a
physical GPU. Reza walked through the rest of the toolbox: binpack, spread and topology-aware
scheduling, memory oversubscription, priority, and support for accelerators beyond NVIDIA such as
Ascend and Cambricon. HAMi also ships a DRA driver, which is where the two approaches meet.

## A certified Kubernetes AI platform underneath

![Certified Kubernetes AI Platform](/img/talks/2026-07-25/slide-22.jpg)

Before the numbers, the platform under them. CNCF's Kubernetes AI Conformance program certifies that a
platform runs AI workloads the standard way: DRA support, gang scheduling, accelerator and AI-service
metrics, secure accelerator access, Gateway API for inference, and pod and cluster autoscaling. Our AI
platform is certified on Kubernetes v1.35 ([conformance submission](https://github.com/cncf/k8s-ai-conformance/tree/main/v1.35/viettel-ai-platform)). At the time of the talk it was
one of 31 certified platforms worldwide, next to AWS, Google Cloud, Azure, Oracle and Red Hat OpenShift,
and the first from Vietnam.

Two of those requirements are exactly where GPU sharing gets tested. Accelerator access has to stay secure
when several pods share one card, and accelerator metrics have to work per pod, not only per physical
GPU.

![Showing Reza the Viettel AI Platform (Viettel Cloud AI-Native) at the booth](/img/talks/2026-07-25/photo-booth.jpg)

*Showing Reza the Viettel AI Platform (Viettel Cloud AI-Native) at the booth.*

## What we run

![What we run today](/img/talks/2026-07-25/slide-23.jpg)

HAMi 2.9 runs on both of our clusters: an H200 pool, and a pool of mixed GPUs (L40, L40S, A30, A6000). It
sits next to Slinky, inference workloads and KEDA, with two schedulers side by side. The memory limit is
real: inside a pod with a 2 GB slice, `nvidia-smi` shows 2 GB, not 141. This is all a user writes:

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 2000   # MB, a hard limit
    nvidia.com/gpucores: 30   # %, best effort
```

Most researchers never write even that. They pick a GPU size in a notebook UI built on Kubeflow
Notebooks. We also monitor per-pod GPU usage, which DCGM alone can't give you, since it reports per
physical GPU. Most numbers below come from the H200 pool, a few from L40.

## The problem, measured

![The problem we measured](/img/talks/2026-07-25/slide-24.jpg)

Two real jobs, each holding a whole H200 with 141 GB:

- **Time-series forecasting** with Chronos, a foundation model of about 200M parameters, predicting
  infrastructure load and telemetry. It used **1 GB of 141**, and 16 to 18% of compute.
- **A training job** in a notebook: YOLO11 on about 17,000 high-resolution photos, detecting damage on
  electrical cabinets. It used **39 GB**.

Someone always asks why only 39. The batch size is picked for accuracy, not memory: it's a small model at
high resolution, and a bigger batch makes the mAP worse. The model is already busy about 90% of the time,
and pushing further makes the data pipeline the bottleneck long before VRAM fills. So 39 GB is the right
size, and the other 100 GB really is spare.

The part people forget: L40, L40S and A6000 have no MIG. Hardware slicing isn't an option on most of
that fleet. Kubernetes alone gives one answer, the whole card or nothing.

## 3.4× more work per GPU

![The result: 3.4x more work per GPU](/img/talks/2026-07-25/slide-25.jpg)

Same GPU, same Chronos job, same latency target:

| Setup | Requests/s at P95 160 ms | GPU (SM) used |
|---|---|---|
| One pod, whole card | 20.7 | 18% |
| One pod, HAMi slice | 19.6 | n/a |
| HAMi + KEDA, scale replicas | **71.1** | 100% at 10 replicas |

HAMi doesn't make one pod faster. It fills the GPU that was sitting empty. Serving 71 req/s natively
would take about 3.4 cards; here it takes one. That's about 71% fewer cards, and by our measured
wattages about half the power.

When I showed this to my team, the first reply was that the baseline wasn't fair. So we went back and
tried three things. With no latency limit at all, one pod topped out at 29.6 req/s, with P95 going from
57 ms to 6.2 s and the GPU still around 10%. Batch size from 32 up to 512 left the GPU at 7 to 10%. TF32,
bfloat16 autocast and dtype changes did nothing. One instance of this model can't fill an H200, however
you tune it.

## Reserving space costs time, on purpose

![One card, one day](/img/talks/2026-07-25/slide-26.jpg)

The spare space goes to whatever needs it: small LLMs, agents, vision and embedding jobs. To make that
space real rather than "free if training happens to be idle", we cap the notebook:

- **Memory is fenced.** The notebook sees only its slice and can't OOM its neighbours.
- **Cores are capped** with `force`, at 70%, so the rest of the card is actually reserved.
- **That costs about 20 minutes.** One training run goes from 1 h to 1 h 20. Cheap for a small model,
  much less cheap for a big one.

![The rest follows the load](/img/talks/2026-07-25/slide-27.jpg)

Across a day the notebook block never changes, and everything else follows the load. Early morning,
forecasts burst to six instances. Office hours, LLM inference on models under 20B takes the space.
Overnight, more notebooks and training run instead of the card sitting idle.

## Pick the jobs that benefit

![But it does not always help](/img/talks/2026-07-25/slide-28.jpg)

This is the slide I'd keep if I could keep one. Fractional GPU helps when a job is small or bursty and
can't fill the card alone. It doesn't help when the job already fills the GPU, and we measured that
twice:

- **LLM serving.** SGLang on one H200: one big instance gave 11.6k tokens/s, four small ones gave 7.3k.
  Continuous batching already keeps the GPU busy.
- **Training.** The same LSTM job packed 1, 2 and 4 times on one card: 2,779, then 2,278, then 2,148
  samples/s in total. At 4×, that's 0.77 of a single job.

When the card is already full, packing buys isolation and fair share, not throughput.

Be careful what you promise users, too. `gpumem` is a real limit. `gpucores` is a hint: two pods given
10% and 90% of the same card ran the same workload at the same speed, about 11 ops/s each. Under
contention it becomes fair share. With `force` the cap becomes real, at the cost we just saw. Promise
memory; don't promise compute.

## What it really took

![What it really took](/img/talks/2026-07-25/slide-29.jpg)

The Helm chart was the easy part.

1. **Kyverno blocked HAMi.** Its device plugin needs host paths, the driver and a kubelet socket, so it
   runs privileged. Our policies reject exactly that, so we added an exception for the `hami-system`
   namespace only.
2. **The GPU Operator also registers `nvidia.com/gpu`.** We turned off the operator's device plugin, and
   turned CDI off: in CDI mode the toolkit wires devices its own way, and HAMi's library needs the legacy
   runtime path.
3. **Fractional pods, full-GPU pods and Slinky fought over nodes.** HAMi got its own pool, its own
   scheduler and a taint.
4. **HAMi 2.9 renamed every metric**, and our dashboards went empty. We moved to the new names and sent
   the docs fix upstream ([website#498](https://github.com/Project-HAMi/website/pull/498)).

If you remember one thing: this is an operations project, not a one-line install.

## Where the magic breaks

![Where the magic breaks](/img/talks/2026-07-25/slide-30.jpg)

HAMi sits in front of every CUDA call, so anything that goes around CUDA is invisible to it. What stays
inside CUDA held up, multi-GPU included: peer-to-peer, all-reduce and tensor parallel with CUDA graphs
all passed on NCCL 2.28, and so did an old NCCL forced onto the legacy path.

Two things did break. A **musl** image (Alpine, busybox) can't load `libvgpu`, which needs glibc: the
container dies with `libdl.so.2 not found` and exit code 127 before your code runs. The fix is a glibc
base image. And **MATLAB** froze before it ever reached a CUDA call, because HAMi waits at the CUDA
layer and MATLAB never gets there.

## What's next

More GPU pools, more kinds of workload sharing a card, and a move to DRA: the same isolation, requested
the standard Kubernetes way instead of through a custom resource name. And the reason we picked HAMi in
the first place is multi-vendor. Our GPUs won't always be NVIDIA, and HAMi already supports Ascend,
Cambricon and others.

## Further reading

- [HAMi](https://github.com/Project-HAMi/HAMi) on GitHub, and the [project site](https://project-hami.io).
- A few weeks later, HAMi recognized my contributions to the project with a
  [Contributor Recognition](/notes/2026-09-11-hami-contributor-recognition.html).

![Speakers at KCD & OpenInfra Days Vietnam 2026](/img/talks/2026-07-25/photo-speakers.jpg)

Thanks to Reza for sharing the stage, to the HAMi maintainers, and to the KCD & OpenInfra Days Vietnam
organizers.

Fractional GPU turned cards that sat mostly empty into 3.4× the work. The craft is in knowing which jobs
leave the card empty, and running the platform so they can share it safely. If you've run HAMi or DRA on your own GPUs and found the line
somewhere else, I'd like to hear about it.
