---
title: "Becoming a Certified Kubernetes AI Platform: notes from our v1.35 submission"
subtitle: "Walking the v1.35 requirements one by one: what the standard asks, and what we showed for Viettel AI Platform."
description: "Field notes from taking Viettel AI Platform through CNCF's Kubernetes AI Conformance program on Kubernetes v1.35: DRA, Gateway API, Kueue gang scheduling, a GPU-metric HPA built on DCGM and Prometheus Adapter, accelerator metrics, secure accelerator access and KServe."
date: 2026-10-25
tags: ["kubernetes", "cncf", "ai-conformance", "gpu", "dra"]
---

*[Đọc bản tiếng Việt](/articles/kubernetes-ai-conformance-viettel-ai-platform-vi.html).*

Kubernetes AI Conformance is not a test suite you pass. For v1.35 it's a YAML checklist plus Markdown
evidence you write yourself, reviewed by CNCF and published on GitHub where anyone can read it. So the
evidence matters more than the badge.

In April 2026 my team took Viettel AI Platform through the program on Kubernetes v1.35. I mentioned the
result in my [KCD Vietnam recap](/articles/recap-kcd-vietnam-2026-hami.html). This is the long version:
each requirement, what the standard asks, what we showed, and the parts that took some plumbing.

*Kubernetes v1.35.3, containerd 2.2.2 and 1.7.28, NVIDIA GPU Operator with driver 580.126.09, Kueue
v0.10.2. Repo state checked on 25 October 2026.*

![The Certified Kubernetes AI Platform logo, from CNCF's artwork repository](/img/ai-conformance/certified-ai-platform-logo.png)

## The badge sits on top of plain conformance

You can't start here. A platform has to be [Kubernetes Conformant](https://github.com/cncf/k8s-conformance)
first, and the AI checklist asks for that link in its metadata.

Our base conformance results landed in `cncf/k8s-conformance` on 8 April, a week after the AI pull
request opened. The Ginkgo run took about two hours:

```
SUCCESS! -- 441 Passed | 0 Failed | 0 Pending | 6914 Skipped
PASS

Ginkgo ran 1 suite in 2h1m0.033057564s
```

The AI pull request ([#85](https://github.com/cncf/k8s-ai-conformance/pull/85)) opened on 1 April and
merged on 22 April, Hanoi time. Certification is valid for one year.

![cncf/k8s-ai-conformance#85: Viettel AI Platform: AI Conformance for v1.35, merged](/img/ai-conformance/pr-85-merged.jpg)

The v1.35 checklist has twelve items: nine MUST, three SHOULD. Each item takes a `status`, a list of
evidence files and a free-text note. Our evidence is nine Markdown files of `kubectl` commands and their
output.

The evidence comes from two bare-metal Ubuntu 22.04 nodes with NVIDIA L40S and L40 GPUs. Certification
is per product and per configuration, so that's the configuration being described.

On 25 October 2026 the `v1.35/` folder lists 23 platforms, and the repo lists 40 distinct platforms
across v1.33 to v1.37. Viettel is the only vendor from Vietnam in it.

![The Certified Kubernetes - AI Platform category on the CNCF Landscape, 25 October 2026](/img/ai-conformance/landscape-ai-platform-2026-10-25.jpg)

## DRA: the v1 API is served out of the box

The requirement: *"Support Dynamic Resource Allocation (DRA) APIs to enable more flexible and
fine-grained resource requests beyond simple counts."*

On v1.35 `resource.k8s.io/v1` is GA and on by default, so a kubeadm cluster serves it without any flag:

```
$ kubectl api-resources --api-group=resource.k8s.io
NAME                     SHORTNAMES   APIVERSION           NAMESPACED   KIND
deviceclasses                         resource.k8s.io/v1   false        DeviceClass
resourceclaims                        resource.k8s.io/v1   true         ResourceClaim
resourceclaimtemplates                resource.k8s.io/v1   true         ResourceClaimTemplate
resourceslices                        resource.k8s.io/v1   false        ResourceSlice
```

We created a `ResourceClaimTemplate` asking for one device of class `gpu.nvidia.com`, and a pod that
references it through `spec.resourceClaims`:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: single-gpu
  namespace: dra-test
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: gpu.nvidia.com
          allocationMode: ExactCount
          count: 1
```

The API server accepted both. Note the `exactly` block. In `v1` a device request is either `exactly`,
one selection, or `firstAvailable`, an ordered list of alternatives.

One detail for anyone reading ahead: the v1.36 and v1.37 checklists no longer list `dra_support` as a
separate item.

## Driver and runtime: the GPU Operator does the boring part

This one is a SHOULD. The platform needs *"a verifiable mechanism"* that the right driver and container
runtime config sit on every accelerator node.

The GPU Operator installs the driver, a toolkit DaemonSet writes the containerd config, and a CUDA
validator pod runs to completion on each node:

```
nvidia-container-toolkit-daemonset-q7jhl   1/1   Running     0   5h8m
nvidia-container-toolkit-daemonset-rgqwj   1/1   Running     0   28h
nvidia-cuda-validator-7hghr                0/1   Completed   0   27h
nvidia-cuda-validator-x72v5                0/1   Completed   0   5h7m
```

The two nodes run different containerd majors (2.2.2 and 1.7.28). The validator completed on both.

GPU sharing is a separate topic. I covered it, with HAMi and the numbers, in the
[KCD recap](/articles/recap-kcd-vietnam-2026-hami.html).

## Gateway API: Envoy Gateway carries the routes

The requirement: a Gateway API implementation for inference traffic, *"which enables capabilities like
weighted traffic splitting, header-based routing (for OpenAI protocol headers), and optional integration
with service meshes."*

We use Envoy Gateway as the implementation, with Envoy AI Gateway (now Agent Router) on top for LLM
routing, model-backend selection and token-based rate limiting. The API group is fully served, including
`ListenerSet` and `TLSRoute` at `v1`.

The test creates a `GatewayClass`, a `Gateway`, an `HTTPRoute` matching on a host name, and a small
Python backend. Once the Gateway reports `PROGRAMMED: True`, one request goes through it:

```
$ curl -v -H 'Host: test.example.local' http://<gateway-ip>:80/
> GET / HTTP/1.1
> Host: test.example.local
...
< HTTP/1.1 200 OK
< server: BaseHTTP/0.6 Python/3.11.15
...
Hello from Viettel AI Platform
```

The request enters Envoy, matches the `HTTPRoute` on the `Host` header, and reaches the backend Service.

## Gang scheduling: Kueue admits the whole Job at once

The requirement: install and run *"at least one gang scheduling solution that ensures all-or-nothing
scheduling for distributed AI workloads (e.g. Kueue, Volcano, etc.)"*

We installed Kueue v0.10.2 from the release manifest, created a `ResourceFlavor`, a `ClusterQueue` with
10 CPU and 10Gi of quota, and a `LocalQueue`. Then a `Job` with `parallelism: 3`, labelled with the
queue name.

The mechanism is worth one paragraph. Kueue suspends the Job on creation, creates one `Workload` for
the whole pod set, and unsuspends the Job only when the whole set fits in quota. All-or-nothing happens
at admission, before the scheduler sees a single pod.

```
$ kubectl get workloads -n gang-scheduling-test
NAME                      QUEUE          RESERVED IN    ADMITTED   FINISHED   AGE
job-gang-test-job-b942a   gang-test-lq   gang-test-cq   True       True       83s
```

The three pods logged start times of 09:29:23, 09:29:24 and 09:29:25, and all three completed.

A tip if you build on this: Kueue admits against quota, not against free nodes. If your pods must
actually start together, look at `waitForPodsReady`.

## Cluster autoscaling: the "if" matters on bare metal

The requirement opens with a condition: *"If the platform provides a cluster autoscaler or an equivalent
mechanism, it must be able to scale up/down node groups containing specific accelerator types based on
pending pods."*

On bare metal there are no node groups to scale. A new GPU server joins with `kubeadm join`, then the
GPU Operator installs the driver, configures the runtime and advertises the GPUs:

```
NODE         GPU   CPU
gpu-node-1   2     96
gpu-node-2   2     96
```

Pod-level scaling is where autoscaling happens on this setup, which is the next requirement.

## Pod autoscaling: from DCGM to the HPA

The requirement: HPA must work for pods that use accelerators, *"including the ability to scale these
Pods based on custom metrics relevant to AI/ML workloads."*

CPU first. Install metrics-server, add `--kubelet-insecure-tls` because the kubelets on these bare-metal
nodes serve certificates metrics-server won't verify, then load a small web server. The HPA went from 1
to 10 replicas at `cpu: 436%/20%`, and back to 1 after the load was gone.

Then the GPU metric. A [commit on 17 April](https://github.com/cncf/k8s-ai-conformance/commit/a8593f0)
extended this part to show scale-out under real GPU load: a PyTorch loop multiplying two 8192×8192
matrices.

The pipeline has four pieces. DCGM exporter labels each GPU series with the `namespace`, `pod` and
`container` that holds the device. Prometheus scrapes the exporter pods. Prometheus Adapter turns the
series into a custom metric:

```yaml
rules:
  custom:
    - seriesQuery: 'DCGM_FI_DEV_GPU_UTIL{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      name:
        matches: "DCGM_FI_DEV_GPU_UTIL"
        as: "dcgm_fi_dev_gpu_util"
      metricsQuery: 'avg_over_time(DCGM_FI_DEV_GPU_UTIL{<<.LabelMatchers>>}[2m])'
```

And the HPA targets it as a `Pods` metric with `averageValue: "50"`. The pod sat at 100, so:

```
Events:
  Normal  SuccessfulRescale  38s   horizontal-pod-autoscaler  New size: 2; reason: pods metric dcgm_fi_dev_gpu_util above target
  Normal  SuccessfulRescale  8s    horizontal-pod-autoscaler  New size: 4; reason: pods metric dcgm_fi_dev_gpu_util above target
```

Two details in that rule do the real work. `namespace!="",pod!=""` drops GPUs that no pod holds, so idle
cards never pull the average down. And `DCGM_FI_DEV_GPU_UTIL` is a device-level number. It maps cleanly
to a pod here because each pod owns a whole GPU.

## Accelerator metrics: read the raw endpoint

The requirement: at least one metrics solution with per-accelerator utilization and memory, plus
temperature, power and interconnect bandwidth where the hardware exposes them, in a standard,
machine-readable format.

DCGM exporter ships with the GPU Operator and listens on port 9400. We curled it from inside the cluster
and published the raw lines, trimmed here:

```
DCGM_FI_DEV_SM_CLOCK{gpu="0",...,modelName="NVIDIA L40S",Hostname="gpu-node-1",DCGM_FI_DRIVER_VERSION="580.126.09"} 210
DCGM_FI_DEV_GPU_TEMP{gpu="0",...,modelName="NVIDIA L40S",...} 32
DCGM_FI_DEV_POWER_USAGE{gpu="0",...,modelName="NVIDIA L40S",...} 34.156000
DCGM_FI_DEV_GPU_UTIL{gpu="0",...,modelName="NVIDIA L40S",...} 0
DCGM_FI_DEV_FB_FREE{gpu="0",...,modelName="NVIDIA L40S",...} 45457
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="0",...,modelName="NVIDIA L40S",...} 0.000000
```

Every series carries `DCGM_FI_DRIVER_VERSION` as a label. That's a free cross-check for the driver item
above.

## AI service metrics: Alloy collects, Prometheus feeds the HPA

The requirement: a monitoring system that can discover and collect metrics from workloads that expose
them in a standard format such as Prometheus exposition.

Grafana Alloy does the general collection: the KServe controller's `/metrics` on port 8080, Envoy's
`/stats/prometheus` for the AI gateway, and the DCGM exporter. A Prometheus server scrapes the DCGM
exporter for Prometheus Adapter, which serves `custom.metrics.k8s.io` to the HPA above.

## Secure accelerator access: a pod without a request sees nothing

The requirement: access to accelerators from containers must be *"properly isolated and mediated by the
Kubernetes resource management framework (device plugin or DRA) and container runtime."*

The test is two pods. The first asks for no GPU:

```
=== Test: Pod WITHOUT GPU request ===
PASS: No GPU devices visible (expected)
nvidia-smi check:
sh: 8: nvidia-smi: not found
PASS: nvidia-smi not available (expected)
```

Not even the `nvidia-smi` binary exists in that container. The container toolkit injects device nodes
and driver files only for devices the device plugin allocated. No request, no injection.

The second asks for `nvidia.com/gpu: 1`:

```
=== Test: Pod WITH GPU request ===
GPU 0: NVIDIA L40 (UUID: GPU-c3c7096e-db9d-322f-efd9-510971f3d33c)
---
/dev/nvidia-modeset
/dev/nvidia-uvm
/dev/nvidia-uvm-tools
/dev/nvidia1
/dev/nvidiactl
```

One GPU device node, `nvidia1`, plus the control devices. The node has `nvidia0` too, and the pod
doesn't see it.

## Robust controller: KServe, webhooks included

The requirement: at least one complex AI operator with a CRD installs and works reliably. Pods run,
webhooks answer, custom resources reconcile.

We used KServe. Seven CRDs, including `LLMInferenceService` with its own `llmisvc-controller-manager`.
One mutating and seven validating webhook configurations. Nine `ClusterServingRuntimes` reconciled, from
HuggingFace to TensorFlow Serving. Then an `InferenceService`:

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: sklearn-iris
  namespace: kserve-test
spec:
  predictor:
    sklearn:
      storageUri: "gs://kfserving-examples/models/sklearn/1.0/model"
```

The validating webhook accepted it and the controller picked it up for reconciliation. That covers all
three things the requirement names: controller pods, webhooks and a reconciled custom resource.

## The next round looks different

From v1.37 the program recommends running the upstream [AI Conformance test
suite](https://github.com/kubernetes-sigs/ai-conformance/tree/main/test) and attaching its `junit.xml`
or `e2e.log` for the items it covers. The suite already has tests for gang scheduling, cluster
autoscaling, driver and runtime management and AI service metrics. A test runner checks the same thing
the same way for every platform.

The badge is a logo on a landscape page. The evidence is ten files on GitHub, and anyone can read them.
[Ours are here](https://github.com/cncf/k8s-ai-conformance/tree/main/v1.35/viettel-ai-platform). If
you're preparing a submission and stuck on one of these items, read them and email me.
