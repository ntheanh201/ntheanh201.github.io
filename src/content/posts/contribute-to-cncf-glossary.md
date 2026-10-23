---
title: "Hướng dẫn đóng góp dịch thuật cho CNCF Glossary"
description: "CNCF Glossary là một dự án mã nguồn mở nhằm cung cấp định nghĩa đơn giản, dễ hiểu về các thuật ngữ Cloud Native bằng nhiều ngôn ngữ khác nhau. Bài viết này sẽ hướng dẫn bạn cách…"
date: 2025-05-02
tags: ["cncf", "glossary"]
---

CNCF Glossary là một dự án mã nguồn mở nhằm cung cấp định nghĩa đơn giản, dễ hiểu về các thuật ngữ Cloud Native bằng nhiều ngôn ngữ khác nhau. Bài viết này sẽ hướng dẫn bạn cách tham gia đóng góp dịch thuật cho dự án.

## Các bước tham gia đóng góp

### 1. Fork Repository

-   Truy cập [https://github.com/cncf/glossary](https://github.com/cncf/glossary)
-   Click nút "Fork" để fork repository về GitHub của bạn, lưu ý: fork nhánh dev-vi.

### 2. Clone Repository về máy local

```bash
git clone <https://github.com/$user/glossary.git>
cd glossary
git remote add upstream <https://github.com/cncf/glossary.git>
git remote set-url --push upstream no_push
```

### 3. Tạo branch mới

```bash
git fetch upstream
git checkout dev-vi
git rebase upstream/dev-vi
git checkout -b translate-vi
```

### 4. Thực hiện công việc dịch thuật

-   Các file cần dịch nằm trong thư mục content/
-   Tạo thư mục ngôn ngữ mới (ví dụ: vi/) nếu chưa có
-   Copy file cần dịch từ thư mục gốc sang thư mục ngôn ngữ
-   Thực hiện dịch thuật, đảm bảo giữ nguyên format

### 5. Commit và Push với sign-off

**Phương pháp 1**: Sử dụng flag `--signoff` hoặc `-s`

```bash
git add content/vi/
git commit -s -m "[vi] Add Vietnamese translation for [term]"
git push origin translate-vi
```

**Phương pháp 2**: Cấu hình git để tự động sign-off

```bash
# Cấu hình thông tin cá nhân trước
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"

# Cấu hình tự động sign-off cho mọi commit
git config --global commit.gpgsign true
git config --global commit.template ~/.gitmessage

# Tạo file template
echo "Signed-off-by: $(git config user.name) <$(git config user.email)>" > ~/.gitmessage
```

**Phương pháp 3**: Thêm sign-off thủ công trong commit message

```bash
git add content/vi/
git commit -m "[vi] Add Vietnamese translation for [term]

Signed-off-by: Tên của bạn <email@example.com>"
git push origin translate-vi
```

**Ý nghĩa của sign-off**

Khi bạn sign-off một commit, bạn đang xác nhận rằng bạn có quyền đóng góp code theo giấy phép của dự án và tuân thủ Developer Certificate of Origin (DCO). Đây là yêu cầu bắt buộc của nhiều dự án mã nguồn mở, bao gồm cả các dự án CNCF.

### 6. Tạo Pull Request

-   Truy cập repository đã fork trên GitHub của bạn
-   Click "New Pull Request"
-   Chọn branch translate-vi
-   Điền thông tin Pull Request theo mẫu

## Lưu ý khi dịch

-   Giữ nguyên các thuật ngữ kỹ thuật
-   Đảm bảo tính nhất quán trong việc dịch thuật
-   Tham khảo các bản dịch đã có để học hỏi cách dịch
-   Tuân thủ hướng dẫn đóng góp của dự án

Bạn có thể xem trước kết quả dịch thuật tại [https://glossary.cncf.io/](https://glossary.cncf.io/)

Chúc bạn thành công trong việc đóng góp cho dự án CNCF Glossary!
