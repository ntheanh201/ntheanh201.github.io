---
title: "How GlitchTip helped me solve real-world problem"
description: "Ở bài viết lần đầu tiên chia sẻ về công việc tại Viettel, mình muốn nói về công cụ để theo dõi hiệu năng và tracking lỗi cho ứng dụng mobile, đây là lần mà mình phải đưa ra quyế…"
date: 2023-05-04
tags: ["monitoring"]
cover: "/img/2e66564b03a6c8ef007249b1260bf62a68cb21c0.png"
---

Hi folks 👋,

Ở bài viết lần đầu tiên chia sẻ về công việc tại Viettel, mình muốn nói về công cụ để theo dõi hiệu năng và tracking lỗi cho ứng dụng mobile, đây là lần mà mình phải đưa ra quyết định lựa chọn 1 giải pháp cụ thể nào đó để giải quyết vấn đề, cảm xúc khá lo lắng vì mọi thứ hoàn toàn có thể hoạt động không đúng như dự kiến, gây tốn thời gian và có thể dẫn tới sai sót về số liệu báo cáo 🥲.

Lan man là vậy, nhắc tới việc theo dõi ứng dụng mobile và error tracking, chắc hẳn đa số mọi người đều sẽ nghĩ đến Sentry chăng? 🤔

Sentry là một công cụ giám sát và theo dõi lỗi được sử dụng rộng rãi, hướng tới developer. Nó giúp phát hiện và thông báo các lỗi xảy ra trong hệ thống.

![](/img/500f5f4e384fc212d428ccdbf4198c94340e21e1.png)

 

![](/img/f894724232e8dd394395fca7ac7c2d86f2f2e562.png)

Nhưng ở bài viết lần này, mình muốn giới thiệu thêm cho mọi người một công cụ khác mà mình đã áp dụng tại hệ thống của team: **GlitchTip**.

Trước tiên nói sơ qua chút về vấn đề cần giải quyết:

## Yêu cầu

Với yêu cầu được đặt ra là: bảo mật về dữ liệu và có thể tự triển khai trên hạ tầng Viettel Cloud để theo dõi lỗi cho ứng dụng **VCar** (được code bằng React Native), báo cáo KPI/KQI, mình đã tìm kiếm các tools với tiêu chí sau:

-   Open Source
-   Self-hosted
-   Dễ dàng tích hợp phía client, cụ thể ở đây cần 1 nền tảng hỗ trợ tốt React Native
-   Có thể dùng cách nào đó để lấy dữ liệu và visualize với Grafana dùng cho việc báo cáo KPI/KQI.

## Triển khai Sentry và những khó khăn

![](/img/fa2dcd35259fc17ad4bdb6c6081ee9c3d2d18bcb.png)

First choice, Sentry hoàn toàn đáp ứng được những yêu cầu trên, ngoài bản lưu dữ liệu trên hạ tầng Sentry, Sentry còn cung cấp bản **Self-Hosted Sentry** ([https://develop.sentry.dev/self-hosted](https://develop.sentry.dev/self-hosted/)).

### Khó khăn

Khi quyết định triển khai thực tế, guide của Sentry thì hướng dẫn chạy theo dạng docker-compose, nhưng hạ tầng hiện tại đang được dựng trên Kubernetes. Giờ phải tìm cách để chạy được trên K8s.

Lượn lờ trên Google thì cũng tìm đến 1 bản Helm charts community ([https://github.com/sentry-kubernetes/charts](https://github.com/sentry-kubernetes/charts)), Sentry là 1 hệ thống cực kì phức tạp, có thể thấy được thông qua số lượng manifest.

![](/img/b8d401dc1907e1a007cbd89da106683fad6c47dc.png)

 

![](/img/063443eda200baa283d24d5b414b087ffb9f7340.png)

Sau khi dựng thành công, truy cập trang Sentry thì thi thoảng sẽ xuất hiện lỗi mà không rõ nguyên nhân, chỉ có error message là ***Internal Error***, kiểm tra Network thì thấy sẽ có 1 vài query báo lỗi (I still dunno why 🤔).

![](/img/73c2a919be443261fab5b0ead9942799c2719442.png)

 

![](/img/77c9678b5e7c736fd58b59da090e452c45b6a1f1.png)

Vấn đề tiếp theo là việc query dữ liệu để dựng Dashboard Grafana, bản Self-hosted Sentry hiện tại chưa support để Grafana lấy dữ liệu 😥

### Sự chuyển đổi

Với việc phải kiểm soát 1 hạ tầng quá phức tạp của Sentry, cộng thêm chưa thể hiểu rõ nền tảng này và chưa đáp ứng sát nhu cầu thực tế là có thể dễ dàng lấy dữ liệu để dựng Dashboard trên Grafana, mình quyết định tìm tới phương án Sentry alternative.

Từ 1 người bạn, mình biết được có **GlitchTip** ([https://glitchtip.com/](https://glitchtip.com/)), viết lại hoàn toàn dựa trên phiên bản opensource của Sentry (phiên bản chưa thực hiện chuyển đổi sang Snuba, Clickhouse, …)

Tại sao lại là **GlitchTip**? Cùng tìm hiểu nhé.

## Glitchtip

![](/img/ee854a7773bc1d05cb25008ac82ffa6cf0f82c32.png)

### Giới thiệu

GlitchTip cung cấp những tính năng:

-   **Error Tracking**: Báo cáo, phân loại lỗi ứng dụng, website 
    
    ![](/img/3c3066b4b46412259be481dfc5ac267bdc57375b.png)
    

-   **Application Performance Monitoring**: Theo dõi hiệu năng ứng dụng 
    
    ![](/img/c91f7e374d8dd6bd786def9332cc09d7785c7a6e.png)
    

-   **Uptime Monitoring**: GlitchTip có thể ping tới trang web và cảnh báo khi trang web không phản hồi. Nếu GlitchTip không nhận được lệnh ping, nó sẽ gửi cho bạn một cảnh báo qua email hoặc webhook. 
    
    ![](/img/9a2e6ff6d85ac611f2091ac45a2a5cc1b41ac99b.png)
    

GlitchTip có đáp ứng được những yêu cầu ban đầu được đưa ra? ⇒ **Có**

**Ưu điểm:**

-   Hoàn toàn opensource: [https://gitlab.com/glitchtip](https://gitlab.com/glitchtip)
-   Chỉ sử dụng duy nhất Postgres cho việc lưu trữ các dữ liệu về issue, monitor, … connect vào db là hoàn toàn có thể nhìn thấy rõ các trường dữ liệu. Không cần care về việc khởi chạy Clickhouse, …
-   Dễ dàng kết nối tới db và lấy dữ liệu ra visualize bằng Grafana.
-   Có official Helm charts ([https://gitlab.com/glitchtip/glitchtip-helm-chart](https://gitlab.com/glitchtip/glitchtip-helm-chart)) giúp cho việc triển khai self-hosted dễ dàng hơn khi làm việc với Sentry.
-   Sử dụng chính thư viện client của Sentry cho việc gửi dữ liệu lên server (@sentry/react-native)

**Nhược điểm:**

-   Giao diện của GlitchTip thì quá cơ bản và đơn giản, điểm này thì hoàn toàn không thể bằng Sentry được.
-   Không có nhiều tính năng bằng Sentry (Session Replay, User Feedback, …)

### Khó khăn khi triển khai

Nhìn chung thì với việc deploy GlitchTip sẽ không có quá nhiều khó khăn, việc cần làm cẩn thận đó là đọc kĩ các thông số của các manifest trong Helm charts để thêm values cho đúng với nhu cầu là được.

![](/img/5972e654d3a605efcd26eda2d00c3fbf4f7c6460.png)

Ngoài ra, community của GlitchTip hoạt động khá sôi nổi: [https://app.gitter.im/#/room/#GlitchTip\_community:gitter.im](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)

**Domain**

Ở team mình có 1 vấn đề gặp phải đó là không trực tiếp cấu hình được domain của sản phẩm, hoặc thêm subdomain, mặc định Glitchtip được serve tại path “/”.

Do đó mình và anh lead đã bắt tay vào nghiên cứu và sửa code của chính Glitchtip. Anh lead có kinh nghiệm code Angular nên sửa code FE, mình thì sửa code BE được viết bằng Django để có thể sửa cái path sang “/apm”.

Cũng tính contribute thêm vào Backend của GlitchTip mà không main Python nên lại lười **😂**

**Rebuild image**

Tiếp theo là đọc file GitlabCI rồi tự tay build lại image theo từng bước:

-   Build glitchtip-frontend bằng cmd: `yarn build-prod`
-   Copy build folder: glitchtip-frontend sang glitchtip-backend và đổi tên thành `dist`
-   Update `ARG` `*COLLECT_STATIC*``=True` trong Dockerfile của glitchtip-backend
-   Build docker image → finished.

Update image trong Deployment, update Ingress và chạy thôi nào 🚀

### Thành quả

Giao diện của GlitchTip

![](/img/a9fa12b66fed2e5742f4684cf1730af7e4919ace.png)

Và hoàn toàn có thể tạo được Dashboard theo nhu cầu trên Grafana từ dữ liệu lấy từ db Postgres của GlitchTip phục vụ việc báo cáo (*Hình ảnh mang tính chất minh hoạ, dữ liệu nhạy cảm mình xin phép không đưa lên được* 😄)

![](/img/de68df2caddf1f45d313f2ffc265de14ee2ffcff.png)

## Kết luận

**Sentry** và **GlitchTip** đều là những lựa chọn tốt. Tùy vào yêu cầu và mục đích sử dụng, bạn có thể lựa chọn công cụ phù hợp để giúp đội ngũ phát triển của mình phát hiện và sửa chữa các lỗi một cách hiệu quả nhất.

Hẹn gặp mọi người vào những bài tiếp theo 😁
