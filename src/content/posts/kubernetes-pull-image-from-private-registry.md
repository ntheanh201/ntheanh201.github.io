---
title: "Kubernetes pull image from private registry"
description: "Trong thực tế, nhiều doanh nghiệp sử dụng private registry để lưu trữ Docker images vì lý do bảo mật. Bài viết này sẽ hướng dẫn cách cấu hình Kubernetes để pull images từ privat…"
date: 2022-08-18
tags: ["kubernetes"]
cover: "/img/03a52ae66fd3a4fa30520fc7ee8a61354dd0fcd9.jpg"
---

## 1. Giới thiệu

Trong thực tế, nhiều doanh nghiệp sử dụng private registry để lưu trữ Docker images vì lý do bảo mật. Bài viết này sẽ hướng dẫn cách cấu hình Kubernetes để pull images từ private registry.

## 2. Các bước thực hiện

### 2.1. Tạo Docker registry secret

Đầu tiên, cần tạo một secret chứa thông tin đăng nhập vào registry:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=<your-registry-server> \
  --docker-username=<your-name> \
  --docker-password=<your-password> \
  --docker-email=<your-email>
```

Trong đó:

-   `regcred`: tên của secret
-   `-docker-server`: URL của registry (ví dụ: [https://index.docker.io/v1/](https://index.docker.io/v1/) cho DockerHub)
-   `-docker-username`: username đăng nhập registry
-   `-docker-password`: password đăng nhập registry
-   `-docker-email`: email đăng ký với registry

### 2.2. Sử dụng secret trong Pod configuration

Sau khi tạo secret, thêm trường `imagePullSecrets` vào Pod specification:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: private-pod
spec:
  containers:
  - name: private-container
    image: private-registry.io/apps/internal-app:v1.2.3
  imagePullSecrets:
  - name: regcred
```

## 3. Kiểm tra cấu hình

Có thể kiểm tra secret đã tạo bằng lệnh:

```bash
kubectl get secret regcred -oyaml
```

## 4. Một số lưu ý quan trọng

-   Secret phải được tạo trong cùng namespace với Pod
-   Nếu sử dụng nhiều clusters, cần tạo secret trên từng cluster riêng biệt
-   Có thể sử dụng một secret cho nhiều pods
-   Nên sử dụng Kubernetes Secrets Management để bảo mật thông tin đăng nhập

## 5. Xử lý lỗi thường gặp

Một số lỗi phổ biến khi pull image từ private registry:

-   `ImagePullBackOff`: Kiểm tra lại thông tin đăng nhập trong secret
-   `ErrImagePull`: Xác nhận lại URL của registry và tên image
-   Timeout: Kiểm tra kết nối mạng và firewall rules

Để debug, có thể sử dụng lệnh:

```bash
kubectl describe pod <pod-name>
```

## 6. Best Practices

-   Sử dụng namespace riêng cho từng môi trường (development, staging, production)
-   Định kỳ rotate credentials của registry
-   Sử dụng RBAC để kiểm soát quyền truy cập vào secrets
-   Backup các secret configurations

Source: [https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
