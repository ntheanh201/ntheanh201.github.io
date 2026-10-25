---
title: "Recap #cTENcf Birthday Bash Hanoi: From Vietnam to the World, đóng góp cho Kubernetes và học bổng Linux Foundation"
subtitle: "Không ai bắt đầu với vai trò reviewer Kubernetes cả. Mình bắt đầu từ việc sửa typo trong docs, và chính chuỗi đóng góp nhỏ, công khai đó đã mang về học bổng của Linux Foundation."
description: "Recap bài nói của mình ở #cTENcf Birthday Bash Hanoi, sinh nhật 10 năm của CNCF, 21/9/2025: từ Hacktoberfest và Apache Traffic Control đến Kubernetes SIG Docs, CNCF Glossary tiếng Việt và học bổng LiFT 2025."
date: 2025-09-21
tags: ["talk", "open-source", "kubernetes", "cncf", "community"]
translationOf: recap-from-vietnam-to-the-world
---

*[Read in English](/articles/recap-from-vietnam-to-the-world.html).*

![From Vietnam to the World: Contributing to Kubernetes and earning the Linux Foundation Scholarship](/img/talks/2025-09-21/slide-1.jpg)

Đóng góp từ Việt Nam vẫn được cộng đồng thế giới nhìn thấy, không phải vì nó lớn mà vì nó công khai và
đều đặn. Đó là ý chính trong bài nói của mình ở #cTENcf Birthday Bash Hanoi ngày 21/9/2025, buổi meetup
của Cloud Native Hanoi và VietOpenInfra mừng CNCF tròn 10 năm.

![Mình chia sẻ ở #cTENcf Birthday Bash Hanoi, 21/9/2025](/img/talks/2025-09-21/photo-backdrop.jpg)

Talk có ba phần: mình đến với open source như thế nào, đi từ user lên reviewer Kubernetes ra sao, và
chính hồ sơ đóng góp đó đã giúp mình giành học bổng Linux Foundation Training (LiFT) 2025 như thế nào.

## Bắt đầu từ một chiếc áo phông

![Hacktoberfest: vì sao nên tham gia](/img/talks/2025-09-21/slide-5.jpg)

Cú hích đầu tiên của mình là Hacktoberfest, thử thách đóng góp open source diễn ra vào tháng 10 hằng năm.
Hoàn thành thử thách thì được tặng áo phông và ít sticker, nên lý do bắt đầu khá khiêm tốn, nhưng mà nó
có tác dụng thật.

Mình chọn [Apache Traffic Control](https://github.com/apache/trafficcontrol), một dự án CDN mã nguồn mở
thuộc Apache Software Foundation, vì nó sát với công việc hằng ngày. Cộng đồng active, lại có nhiều chỗ
để góp: bug, dashboard, monitoring, tính năng mới.

Nhưng làm thì không dễ chút nào, vì riêng một pull request
[chuyển các Grafana dashboard dạng dynamic scripted sang Scenes](https://github.com/apache/trafficcontrol/pull/7927)
cuối cùng có 25 commit, 58 file thay đổi và 39 review comment. PR mở ngày 24/1/2024 và được merge ngày
28/2, sau mấy tuần review rồi sửa đi sửa lại.

![PR #7927 của Apache Traffic Control: 25 commit, 58 file, 39 review comment](/img/talks/2025-09-21/slide-7.jpg)

Tổng cộng mình đã mở 21 pull request cho Traffic Control, trong đó 12 cái được merge. Code, sửa bug, viết
docs và tutorial, hỗ trợ contributor khác, cái nào cũng tính là đóng góp. Câu "Start small, grow global"
trên slide hôm đó đến giờ mình vẫn thấy đúng.

## Từ user lên reviewer, qua ba bước

![Lần đầu tiếp xúc Kubernetes: vận hành một cụm production](/img/talks/2025-09-21/slide-11.jpg)

Câu chuyện Kubernetes của mình không bắt đầu từ việc đóng góp, mà từ việc vận hành một cụm production cho
nền tảng connected car, khoảng 80 server. Đó là lần đầu mình làm Kubernetes thật: deploy, troubleshoot,
giữ cho hệ thống ổn định. Mình là user rất lâu trước khi trở thành contributor, và mình nghĩ thứ tự đó là
hợp lý.

**Bước 1: từ user lên contributor.** Vận hành Kubernetes hằng ngày mới thấy docs quan trọng thế nào. Rất
nhiều vấn đề mình gặp lẽ ra đã giải nhanh hơn nếu tài liệu tốt hơn, nên mình bắt đầu sửa những thứ nhỏ
trên repo kubernetes/website, như typo hay mục glossary, rồi tham gia SIG Docs Vietnam để localize và
review nội dung.

![Bước 1: từ user lên contributor](/img/talks/2025-09-21/slide-12.jpg)

**Bước 2: từ contributor lên member.** Mình đóng góp docs đều đặn, review PR, tham gia thảo luận và dự họp
SIG Docs. Tháng 5/2025 mình
[gửi request vào Kubernetes org](https://github.com/kubernetes/org/issues/5593), và những người trong cộng
đồng đã thấy mình làm thì vào +1.

![Bước 2: cộng đồng +1 cho request membership](/img/talks/2025-09-21/slide-14.jpg)

**Bước 3: từ member lên reviewer.** Đến đây thì trách nhiệm đổi khác, vì mình ít đóng góp trực tiếp hơn, nhiều
review hơn, và giúp người mới merge được PR đầu tiên. Đúng một ngày trước buổi talk,
[PR thêm mình làm reviewer và owner của nhóm dịch tiếng Việt](https://github.com/kubernetes/website/pull/52424)
được merge. Câu mình tự hỏi cũng đổi từ "mình sửa được gì?" sang "mình giúp người khác đóng góp thế nào?"

![Bước 3: từ member lên reviewer và approver](/img/talks/2025-09-21/slide-15.jpg)

## Đóng góp không chỉ là code

![CNCF Glossary: được ghi nhận trên CNCF blog](/img/talks/2025-09-21/slide-16.jpg)

Không phải đóng góp nào cũng là code. Mình dẫn dắt bản tiếng Việt của
[Cloud Native Glossary](https://glossary.cncf.io/vi/), để kỹ sư Việt Nam đọc được các thuật ngữ cloud
native bằng tiếng mẹ đẻ. CNCF blog đã giới thiệu bản này vào tháng 6/2025:
[Cloud Native Glossary: the Vietnamese version is live](https://www.cncf.io/blog/2025/06/26/cloud-native-glossary-the-vietnamese-version-is-live/).
Dịch thuật và viết docs là đóng góp thật, và được ghi nhận ở tầm toàn cầu.

Nếu bạn đang tìm chỗ bắt đầu thì [CLOtributor](https://clotributor.dev) giúp tìm các issue hợp cho lần
đóng góp đầu tiên trong các dự án CNCF.

## Học bổng LiFT

Mỗi năm Linux Foundation trao 500 suất học bổng Shubhra Kar Linux Foundation Training (LiFT), chia thành 16
hạng mục, từ Open Source Newbie đến Cloud Champion. Mình nộp đơn vì hai lý do: khoá học và chứng chỉ
Kubernetes nâng cao khá đắt mà mình thì muốn học sâu hơn, và mình muốn đóng góp lại cho cộng đồng ở Việt
Nam.

![Vì sao mình nộp đơn LiFT](/img/talks/2025-09-21/slide-19.jpg)

Đơn có bốn câu hỏi. Dưới đây là câu trả lời của mình, kèm một tip cho từng câu:

1. **Bạn muốn học mảng open source nào tiếp theo, vì sao?** Kubernetes security: cluster hardening, giảm
   lỗ hổng, và software supply chain (SBOM, attestation, verifiable build). *Tip: chọn mảng mình thật sự
   hứng thú và giải đúng vấn đề mình đang gặp.*
2. **Kinh nghiệm open source của bạn?** Kubernetes docs và CNCF Glossary, Apache Traffic Control, cùng vài
   tool cá nhân. *Tip: nêu 2 đến 3 đóng góp mạnh nhất, có số liệu.*
3. **Vì sao điều này quan trọng với tương lai của bạn?** Tối ưu hạ tầng, tăng cường bảo mật, mở rộng hợp
   tác. *Tip: nối sự phát triển của bản thân với lợi ích cho cộng đồng.*
4. **Bạn dùng open source trong công việc thế nào?** CDN trên Traffic Control, nền tảng MLOps trên
   Kubeflow, GitOps, monitoring và observability. *Tip: nói cụ thể tác động: quy mô, hiệu năng, chi phí.*

![Câu 1: muốn học mảng open source nào tiếp theo](/img/talks/2025-09-21/slide-21.jpg)

![Câu 2: kinh nghiệm open source](/img/talks/2025-09-21/slide-22.jpg)

Và mình đã được chọn. Học bổng gồm một khoá eLearning của Linux Foundation và một lượt thi chứng chỉ, hoàn
toàn miễn phí. Hơn cả khoá học, đó là sự ghi nhận từ Linux Foundation, và là bằng chứng rằng những đóng
góp nhỏ từ Việt Nam vẫn được nhìn thấy từ phía bên kia.

![Nhận học bổng LiFT 2025](/img/talks/2025-09-21/slide-25.jpg)

## Đến lượt bạn

![From Vietnam to the World: lời kêu gọi](/img/talks/2025-09-21/slide-26.jpg)

![Kêu gọi mọi người bắt đầu từ việc nhỏ](/img/talks/2025-09-21/photo-speaking.jpg)

Điều mình nhờ cả phòng hôm đó cũng là điều mình muốn nhờ bạn đọc:

- **Tham gia cộng đồng:** Cloud Native Hanoi và VietOpenInfra.
- **Bắt đầu nhỏ:** sửa một typo, dịch một thuật ngữ, mở PR đầu tiên.
- **Dùng công cụ:** [clotributor.dev](https://clotributor.dev) để tìm good first issue.
- **Đều đặn:** mỗi tuần một PR, mỗi tháng một review, rồi sẽ cộng dồn lại.

![Bánh sinh nhật: 10 năm, 230 dự án, hơn 275.000 contributor](/img/talks/2025-09-21/photo-cake.jpg)

![Mọi người ở #cTENcf Birthday Bash Hanoi](/img/talks/2025-09-21/photo-group.jpg)

Chúc mừng sinh nhật 10 năm, CNCF. Nếu bạn mở PR docs Kubernetes tiếng Việt đầu tiên thì cứ tag mình nhé,
giờ mình là một trong các reviewer rồi :)
