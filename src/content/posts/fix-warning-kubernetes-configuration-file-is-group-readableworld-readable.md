---
title: "Fix Warning: Kubernetes configuration file is group-readable/world-readable"
description: "WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/ubuntu/.kube/config WARNING: Kubernetes configuration file is world-readable. This is…"
date: 2022-08-19
tags: ["kubernetes"]
---

**WARNING**: Kubernetes configuration file is group-readable. This is insecure. Location: /home/ubuntu/.kube/config WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/ubuntu/.kube/config

`chmod o-r ~/.kube/config`

`chmod g-r ~/.kube/config`
