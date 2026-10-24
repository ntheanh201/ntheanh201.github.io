---
title: "Recap VOI & CNVN x AWS FCAJ Meetup: Turning GPU-Hours into Tokens, and Tokens into a Service"
description: "My talk with my teammate Minh at the Cloud & AI Infrastructure meetup by OpenInfra User Group Vietnam, Cloud Native Vietnam and AWS First Cloud AI Journey, AWS Hanoi, 24 Oct 2026: one hub, many GPU clusters, Agent Router at the door, NVIDIA Dynamo behind it, and what people asked after."
date: 2026-10-24
tags: ["talk", "multi-cluster", "agent-router", "nvidia", "dynamo", "llm-d", "kubernetes", "gpu"]
---

*[Đọc bản tiếng Việt](/articles/recap-turning-gpu-hours-into-tokens-vi.html).*

[![Turning GPU-Hours into Tokens, and Tokens into a Service: open the slides](/img/talks/2026-10-24/slide-1.jpg)](/talks/turning-gpu-hours-into-tokens.pdf)

*Click the cover for the full slides.*

Keep the control plane and the data plane apart, and a GPU platform can grow one piece at a time: a new
cluster, a new engine, a newer gateway, each swapped or upgraded without touching the rest. That was the
spine of the talk my teammate Minh and I gave today at Cloud & AI
Infrastructure, a community meetup at the AWS office in Hanoi. It was also where most of the questions
went afterwards.

![The speakers: Minh and me](/img/talks/2026-10-24/slide-2.jpg)

The NVIDIA Dynamo part of our work already has a [full write-up](https://viettelcloud.vn/en/tech-blog/4/142), which NVIDIA lists
as a case study in the Dynamo docs. The write-up is about getting more tokens out of each GPU. It
doesn't cover the layer around it.

![The Dynamo write-up, listed as a case study in the NVIDIA Dynamo docs](/img/talks/2026-10-24/slide-3.jpg)

Serving many models to many users across several clusters needs more than a serving layer: managing
endpoints across clusters, authenticating every call, enforcing who may call which model and how much,
and recording usage per request. That platform layer is what the talk added, and it's where this recap
goes deeper.

## Where everyone starts

![Capacity is now counted in gigawatts](/img/talks/2026-10-24/slide-4.jpg)

Infrastructure capacity used to be counted in workers and raw materials. Now people ask how many
gigawatts a data center has. Land, power and silicon go in, tokens come out, and the box in the middle
turns GPU-hours into tokens. The framing is borrowed from Coatue's Publics Update (October 2026); the
diagrams are my redraw.

![Tokens are the unit of intelligence](/img/talks/2026-10-24/slide-5.jpg)

Most of us have built the smallest version of that box. A pod running `vllm serve`, a Kubernetes Service in front,
requests spread evenly across pods. It works, and for a small team it's enough. Then you get many users,
each with an API key and a limit, several models at once, and prompts of a hundred thousand tokens from
coding agents. Things start breaking one at a time. The talk went through those breaks, adding one piece
for each.

## Control plane and data plane, kept apart

![One hub, many GPU clusters](/img/talks/2026-10-24/slide-7.jpg)

We don't run one cluster. We run several, in different places, built at different times. The picture
on the slide is hub-and-spoke, but the idea behind it is older: split the part that decides from the
part that serves. It's the same split Kubernetes makes between the API server and the kubelet.

The **hub is the control plane**. It creates and deletes endpoints, holds tenants and policy, and
decides which cluster a model runs on. It writes desired state and then steps out of the way.

Each **spoke is data plane**: a GPU cluster that serves on its own, with Agent Router at the door,
Dynamo in the middle and GPUs at the bottom. Requests go straight into a spoke and never pass through
the hub.

What crosses the line between them is deliberately small:

1. A declarative deployment going down (today a `DynamoGraphDeployment`).
2. A policy revision going down, pulled into the spoke's local cache and acknowledged.
3. Usage events and status coming back up.

That small contract is what buys the room to grow:

- **Serving doesn't wait on the control plane.** No request pays for a round trip to the center, and
  if the hub has a bad day, spokes keep serving within the policy they already hold.
- **Scaling out is adding a spoke.** A new cluster has to honor the contract, nothing more.
- **Components get replaced or upgraded one at a time.** Inside a spoke, the pieces talk through narrow
  interfaces too: the gateway sees an OpenAI-compatible backend, Dynamo sees an engine as a worker image.
  Upgrading Dynamo in one cluster, or moving an endpoint from vLLM to SGLang, doesn't touch the hub. The
  control plane can change how it places models, for example handing cluster choice to Karmada later,
  without touching serving.

What it doesn't do yet, said plainly: one endpoint lives in one cluster, and there's no automatic
failover between clusters. The rest of the talk zoomed into one spoke.

## Part 1: a front door per cluster

Minh took this half. Each cluster gets its own gateway,
[Agent Router](https://github.com/theagentrouter/agent-router), formerly Envoy AI Gateway and an
Agentic AI Foundation project since September. It understands LLM requests: it reads the `model` field
in the body to route. Two Envoy filters do most of the work. `ext_authz` calls an auth service before
the request goes anywhere. `ext_proc` emits a usage event after the response.

**Identity and admission.** The client sends an API key and a model name. The auth service checks the
key and whether it may use that model, then builds a trusted context with who is calling, written into
internal headers.

Whatever identity values the client
sent are dropped and overwritten. Limits sit at three levels (platform and model, team, single key), each
with requests per second, concurrency and token quota. Every check has to pass, or the
gateway returns 401, 403 or 429 without touching a GPU.

![Regional policy enforcement](/img/talks/2026-10-24/slide-12.jpg)

**Policy is checked in the spoke.** If every request called the hub, the hub would add latency to
everything and become the one thing that takes everything down. So each cluster has its own auth service
and a local cache for policy and counters, and the hub syncs model access, rate limits and quota down to
it. On the normal path a request is checked locally and never calls the hub.

The price is that state between regions arrives with a delay, so inside that window usage can go a little
over a limit. We accepted that for latency, and so one region failing doesn't drag the others down.

Three rules held the half together: no side doors, fail closed on auth, and trust only the verified
context.

## Part 2: more tokens from every GPU-hour

I took the second half. Before getting into Dynamo, the context: we had three problems, and none of them
were about the model. The agentic coding endpoint got less throughput per GPU than the hardware allowed.
Scaling was manual and slow. Picking an engine was a bet made once at deploy time. Same root cause: the
fix belongs above the inference engine.

Dynamo isn't an engine. vLLM, SGLang or TensorRT-LLM still runs the model. Dynamo sits above it: an
OpenAI-compatible frontend, a router that picks the worker, a Planner that scales, and shared KV storage,
all declared in one `DynamoGraphDeployment`. The short version of what we measured:

- **KV-aware routing and a shared KV pool.** Coding-agent prompts had a median around 83k tokens, with
  about 95% repeated from earlier turns. Round-robin sends three turns in four to a worker that has never
  seen the session. Routing to the worker that holds the prefix, then adding a pool in host RAM
  ([Mooncake Store](https://github.com/kvcache-ai/Mooncake)) read over RDMA, moved the cache hit rate
  from 17% to 29% to 82%.
- **Stacked up on two H200 nodes**, with speculative decoding on top: from about 340 to about 1,500
  output tokens per second, roughly 4.5×, no extra hardware.
- **Splitting prefill and decode** halved ITL p99, 53 ms to 26 ms, for about 7% of throughput. KV moves
  between workers with NIXL over RDMA, on the backend InfiniBand network, separate from the Ethernet
  frontend that carries requests and tokens.
- **Scaling on KV-cache utilization** instead of GPU utilization: TTFT p95 from 44.5 s to between 1.4
  and 3.4 s.
- **Picking the engine by measuring.** On Qwen3.8-27B, SGLang was 26 to 39% ahead at concurrency 32.
  The next release may flip it. In Dynamo, switching is editing one component.

Every number, config and caveat is in the write-up.

### Two networks under one request

![Two networks under one request](/img/talks/2026-10-24/slide-21.jpg)

Networking got more questions than I expected, so a bit more here. One request crosses two different
networks.

The **frontend** is ordinary Ethernet, north-south: the client calls Agent Router, Agent Router forwards
to the Dynamo frontend, and tokens stream back over SSE. Control plane traffic, metrics and pulling model
weights from storage use it too. It has its own NIC on each node, two 200G ports, on Ethernet switches
that never touch the InfiniBand fabric.

The **backend** belongs to the GPUs, east-west. Each HGX node has 8 GPUs, and each GPU gets its own
400 Gb/s InfiniBand NIC. The NICs are wired in rails: GPU 0 of every node shares one leaf switch, GPU 1
shares another, and so on. Inside a node, GPUs talk over NVLink at about 900 GB/s per GPU. Mind the
units: NVLink is gigabytes, InfiniBand is gigabits.

In this setup, what rides the backend is KV cache,
on two paths: prefill to decode through NIXL, and in and out of the shared pool through Mooncake.

The thing to remember: if NIXL can't find an RDMA path, it quietly falls back to TCP. Everything still
works, nothing errors, it's just tens of times slower. For P/D, RDMA is a requirement, not a tuning
option. "Quiet" cuts both ways, too. Running P/D with NIXL over UCX, every KV transfer finished and the
request still came back as a 500, because the bug sat in the metrics code after the transfer. We sent
the fix to vLLM and it was merged ([#57734](https://github.com/vllm-project/vllm/pull/57734)).


## Each layer makes one decision

![Each layer makes one decision](/img/talks/2026-10-24/slide-28.jpg)

Put together: the hub decides which cluster a model runs on. Inside the cluster, Agent Router decides
whether a request gets in, how much it may use, and which model it goes to. The Dynamo frontend decides
which worker takes it and how many replicas exist.

Each decision lives in one place, so a change touches one layer. A new limit is a change in the control
plane, and the gateway doesn't redeploy. A new engine or a P/D split is a change in the
`DynamoGraphDeployment`, and the gateway and control plane don't know. No layer guesses for another: the
gateway doesn't pick workers by KV cache, because it can't see the cache.

## What's next: NVIDIA DSX OS

![Dynamo is one piece of NVIDIA DSX OS](/img/talks/2026-10-24/slide-29.jpg)

We closed on NVIDIA DSX OS, which Dynamo, Grove and KAI Scheduler belong to. It behaves more like a
package repository than an OS you install once, and we take one component at a time, only when it solves
a problem we've measured. The map above is where each component stands for us today: in use, being
tried, later, or not a fit for this hardware yet, plus the places where we've had PRs merged upstream.

The part that connects to this talk is placement across clusters: Karmada to choose the cluster, KAI to
share GPUs inside it, Workload-Map so every layer reads the same `DynamoGraphDeployment`. That's next,
not done. I hope to come back to a meetup soon and share more about DSX OS, once we have results worth
showing.

## What people asked, and the longer answers

On stage I only had time for the short version of each answer. These are the fuller ones, written
after the talk with the numbers and caveats I didn't have in my head at the time.

### "What about other vendors? Could a cluster run llm-d instead of Dynamo?"

These two came up separately, but they have the same answer, and it's the one the control plane and
data plane split exists for.

The hub is independent of what runs in a cluster. The contract between them doesn't mention hardware or
a serving stack: a deployment going down, a policy revision going down, usage and status coming back,
and an OpenAI-compatible endpoint behind Agent Router.

So each spoke can pick the stack that fits its
hardware. Cluster A on NVIDIA GPUs runs Dynamo. Cluster B on a different AI accelerator could run llm-d,
or whatever that vendor supports best. The hub only needs a different deployment template for B, and
users see the same API either way.

That's not a stretch for llm-d. Its P/D guide ships setups for AMD GPUs, Intel XPU, Google TPU and
several NPUs alongside NVIDIA
([guide](https://github.com/llm-d/llm-d/tree/main/guides/pd-disaggregation)). And Agent Router can
route to an `InferencePool`, the resource llm-d uses, as well as to a plain service like the Dynamo
frontend ([docs](https://aigateway.envoyproxy.io/docs/capabilities/inference/inferencepool-support)).

On NVIDIA hardware we chose Dynamo because one frontend covers KV-aware routing, P/D and autoscaling for
vLLM, SGLang and TensorRT-LLM, and switching engines by benchmark is something we actually do. It's not
a ranking: both move KV cache with [NIXL](https://github.com/ai-dynamo/nixl) over RDMA, NVIDIA is a
founding contributor to llm-d, and Dynamo's KV router can itself run as llm-d's Endpoint Picker.

What I can't claim yet: every spoke we run today is NVIDIA, and all of them run Dynamo. A non-NVIDIA
spoke is something the architecture allows, not something we've done. The work would be a new engine
build, a new network and a new round of measuring.

### "What does asynchronous usage cost you?"

Usage is recorded off the request path: after each response the gateway emits one usage event, and
metering processes it later. Responses never wait for it.

What it buys: a metering outage doesn't block responses, there's no extra hop on the request path,
metering scales on its own, and a hub outage doesn't stop serving within the limits a spoke already
holds.

What it costs:

- **Counters lag.** A caller can go over a usage limit inside the lag window. The checks that protect
  GPUs, requests per second and concurrency, stay synchronous in the spoke. Only the usage records are async.
- **Events can arrive twice**, so processing must be idempotent: each request counted once.
- **Events can go missing.** Async means you have to prove nothing was lost: end-to-end integrity,
  traceability, reconciliation. That's the slowest part to get right.
- **Streaming holds the edge cases.** The final token count only exists at the end of a stream, so a
  stream cut halfway is the first case to test.

I'd make the same call again. A synchronous call to a central service on every request turns a
measurement problem into an availability problem.

## Further reading

- [Slides from the talk](/talks/turning-gpu-hours-into-tokens.pdf)
- The Dynamo write-up, on the [Viettel Cloud Tech Blog](https://viettelcloud.vn/en/tech-blog/4/142),
  listed in [NVIDIA Dynamo External Publications](https://docs.nvidia.com/dynamo/external-publications).
- [Agent Router](https://github.com/theagentrouter/agent-router),
  [NVIDIA Dynamo](https://github.com/ai-dynamo/dynamo), [llm-d](https://github.com/llm-d/llm-d).

Thanks to the organizers from AWS First Cloud AI Journey, OpenInfra User Group Vietnam and Cloud Native
Vietnam, and to everyone who stayed for the questions.

Keep the control plane out of the request path, and a new cluster, a new engine or a newer gateway is a
change in one place instead of a new project. If you serve across clusters and drew the line somewhere else, I'd like to hear why.
