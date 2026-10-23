---
title: "AICR v1.0 shipped, and Viettel Cloud is on the contributor list"
date: 2026-10-07
source: LinkedIn
sourceUrl: https://www.linkedin.com/feed/update/urn:li:activity:7513461351856406528/
---

[AICR v1.0](https://developer.nvidia.com/blog/aicr-v1-0-open-stable-and-verifiable-gpu-cluster-configuration/) just shipped, and Viettel Cloud is on NVIDIA's contributor list, next to Red Hat, Microsoft, Oracle Cloud, SUSE, Akamai, Mirantis and Sidero Labs.

As one of the contributors behind that name, I'm proud of it.

![Contributors by organization: 24+ organizations identified from contributors' GitHub profiles, including Viettel Cloud. Organizations are taken from contributors' public GitHub profiles; contributions are individual and do not necessarily represent the organizations shown.](/notes/aicr-v1-contributors-by-organization.jpg)

*Figure shared by Yuan Chen in the #aicr channel.*

AICR is open source under Apache 2.0, and it is built on four independent capabilities:

- **Snapshot** records observed cluster state, including Kubernetes, operating system, kernel, GPU, and topology information.
- **Recipe** describes the desired, version-locked component configuration and the constraints and validation phases that apply to it.
- **Bundle** renders the recipe into artifacts for the operator's preferred deployment tooling.
- **Validation** compares the recipe with observed state and, where declared, runs deployment, conformance, and performance checks against the cluster.

AICR's version 1.0 then commits to a stable compatibility contract across the CLI, the REST API, the Go SDK, the bundle layout and the artifact schemas, with committed baselines checked before merge, so integrators build on public interfaces instead of internal ones. Recipes and evidence are public at [validation.aicr.run](https://validation.aicr.run).

The numbers Yuan Chen shared in the #aicr channel with v1.0: 2,083 pull requests with 1,865 merged, around 180 merged per month since February, 1,031 issues with 854 closed, 94 contributors with 49 (52%) outside NVIDIA.

Going from using NVIDIA's software to being listed as a contributor to it is a long road, and my team is at the start of it. If you run GPU Kubernetes and want to know which configuration a vendor actually validates, this is the project to watch: Yuan Chen and Christopher Haar have the AICR talk at KubeCon NA 2026, November 9-12 in Salt Lake City.
