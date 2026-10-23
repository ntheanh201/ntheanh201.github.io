---
title: "NVIDIA đang đi theo hướng mở, và DSX OS là ví dụ rõ nhất"
date: 2026-10-03
source: Facebook
sourceUrl: https://www.facebook.com/ntheanh201/posts/pfbid0JDGsH7k7kQt3DmThny2od6o8tGRSb5DrRmsC2Rrkmkn8yDWf27KXSGKbWaBzoXL8l
lang: vi
---

Theo dõi NVIDIA thời gian gần đây, mình thấy rõ là họ đang đi theo hướng "mở" hơn hẳn. Họ đưa project vào CNCF, open source dần các component của AI factory, và chủ động kéo doanh nghiệp dùng mã nguồn mở của họ thay vì chỉ dùng phần mềm đóng đi kèm phần cứng. Là CNCF Ambassador, mình rất vui khi thấy điều này. Team mình cũng có làm việc trực tiếp với NVIDIA về các dự án mã nguồn mở này.

Sắp tới ở KubeCon NA 2026 tại Salt Lake City (9–12/11), Yuan Chen và Christopher Haar (NVIDIA) sẽ trình bày về AICR (AI Cluster Runtime): các recipe GPU đã được validate cho Kubernetes, chạy được trên cloud, on-prem lẫn bare metal, và có thể query, audit được.

AICR là một component của DSX OS, và DSX OS là ví dụ rõ nhất cho hướng đi này: phần lớn component trong đó là mã nguồn mở, và mỗi component có thể cài độc lập.

Mình và team mình đã đặt challenge adopt DSX OS lên hạ tầng H200, đi qua từng component một.

Nhưng tham vọng không dừng ở chỗ dùng được. Mình muốn team mình, và rộng hơn là đơn vị mình làm việc, có thể dẫn đầu khu vực về khả năng adopt và làm chủ mã nguồn mở Hạ tầng AI, khi hệ thống gặp lỗi thì tự tìm ra nguyên nhân và gửi fix lên upstream, thay vì chờ vendor.

Ai để ý [GitHub](https://github.com/ntheanh201) của mình thì sẽ thấy đã có những PR được merge ở KAI Scheduler, Workload-Map, Cluster Readiness Engine hay AICR.

Khi chính NVIDIA đã mở như vậy thì bên cạnh việc sở hữu nhiều GPU, ai hiểu và làm chủ phần mềm chạy trên đó nhanh hơn cũng sẽ có lợi thế rất lớn.
