---
title: "Giám sát ATS Squid Logs với PLG Stack và GeoIP: Phân tích vị trí người dùng theo thời gian thực"
description: "Khi quản lý hệ thống CDN (Content Delivery Network) hoặc proxy server như Apache Traffic Server (ATS), việc phân tích logs là một phần quan trọng để hiểu rõ về lưu lượng truy cậ…"
date: 2024-03-15
tags: ["apache", "cdn", "monitoring"]
---

## Giới thiệu

Khi quản lý hệ thống CDN (Content Delivery Network) hoặc proxy server như Apache Traffic Server (ATS), việc phân tích logs là một phần quan trọng để hiểu rõ về lưu lượng truy cập, hiệu suất hệ thống và phát hiện các vấn đề tiềm ẩn.

Trong bài viết này, chúng ta sẽ tìm hiểu cách kết hợp ATS Squid logs với PLG Stack (Promtail, Loki, Grafana) và tích hợp dữ liệu GeoIP để trực quan hóa thông tin vị trí địa lý của người dùng.

## Apache Traffic Server và Squid Logs

Apache Traffic Server (ATS) là một máy chủ proxy mạnh mẽ và có khả năng mở rộng cao, thường được sử dụng trong các hệ thống CDN. ATS cung cấp nhiều định dạng logging khác nhau, và một trong số đó là định dạng Squid logs.

Squid logs trong ATS có cấu trúc như sau:

```yaml
formats:
- name: squid
  format: '%<cqtq> %<ttms> %<chi> %<cquuh> "%<{User-agent}cqh>" %<cr> %<pssc> %<psql> %<cqhm> %<cquc> %<psct>'
```

Trong đó:

-   `%<cqtq>`: Thời gian yêu cầu (timestamp)
-   `%<ttms>`: Thời gian phản hồi (milliseconds)
-   `%<chi>`: Địa chỉ IP của client
-   `%<cquuh>`: Host đích của yêu cầu
-   `%<{User-agent}cqh>`: User agent
-   `%<cr>`: Kết quả cache (VD: TCP\_MISS, TCP\_HIT)
-   `%<pssc>`: HTTP status code
-   `%<psql>`: Kích thước phản hồi
-   `%<cqhm>`: HTTP method
-   `%<cquc>`: URL đích
-   `%<psct>`: Content type

Ví dụ về một dòng log:

```
1709909405.806 900 16.15.15.205 p1-cdn.cdn.vn "PostmanRuntime/7.36.3" TCP_MISS 200 2711294 GET http://origin.com/tv/155/output/abc.ts video/MP2T
```

## PLG Stack: Promtail, Loki và Grafana

PLG Stack là một bộ công cụ mạnh mẽ để thu thập, lưu trữ và trực quan hóa dữ liệu logs:

1.  **Promtail**: Agent thu thập logs
2.  **Loki**: Hệ thống lưu trữ và index logs
3.  **Grafana**: Nền tảng trực quan hóa dữ liệu

Trong bài viết này, chúng ta sẽ tập trung vào việc cấu hình Promtail để xử lý Squid logs từ ATS và thêm thông tin GeoIP.

## Tích hợp GeoIP với Promtail

GeoIP là dịch vụ cho phép xác định vị trí địa lý dựa trên địa chỉ IP. MaxMind cung cấp cơ sở dữ liệu GeoIP2 được sử dụng rộng rãi cho mục đích này. Promtail có thể tích hợp với cơ sở dữ liệu GeoIP để làm phong phú thêm dữ liệu logs với thông tin vị trí địa lý.

### Cấu hình Promtail

Dưới đây là cấu hình Promtail để xử lý Squid logs từ ATS và thêm thông tin GeoIP:

```
scrape_configs:
{% if ats %}
  - job_name: trafficserver_squid_logs
    pipeline_stages:
    - regex:
        expression: '^(?P<timestamp>\d+\.\d+) (?P<response_time>\d+) (?P<ip>\d+\.\d+\.\d+\.\d+) ((?P<edge_fqdn>\S+)+) "(?P<user_agent>[^"]+)" (?P<outcome>\w+) (?P<status>\d+) (?P<size>\d+) (?P<method>[A-Z]+) (?P<url>[^\s]+) (?P<mime>[^$]+)$'

    - labels:
        timestamp:
        response_time:
        ip:
        edge_fqdn:
        user_agent:
        outcome:
        status:
        size:
        method:
        url:
        mime:
    
    - geoip:
        source: ip
        db: "/opt/mmdb/GeoLite2-City.mmdb"
        db_type: city
    
    - labelallow:
        - geoip_city_name
        - geoip_country_name
        - edge_fqdn
        - outcome
        - status
        - method
        - job
        - host
    - labeldrop:
        - geoip_location_latitude
        - geoip_location_longitude
        - response_time
        - ip
        - url
        - mime
        - size
        - user_agent
    - timestamp:
        source: timestamp
        format: "Unix"
    static_configs:
    - targets:
        - localhost
      labels:
        job: "ats"
        host: {{ ansible_hostname }}
        __path__: "/opt/trafficserver/var/log/trafficserver/squid.log"
{% endif %}
```

### Phân tích cấu hình

1.  **Stage regex**: Sử dụng biểu thức chính quy để phân tích cú pháp dòng log và trích xuất các trường dữ liệu.
2.  **Stage labels**: Chuyển đổi các trường đã trích xuất thành labels.
3.  **Stage geoip**: Sử dụng IP của client để tra cứu thông tin địa lý từ cơ sở dữ liệu MaxMind.
4.  **Stage labelallow/labeldrop**: Lọc các labels để chỉ giữ lại những thông tin cần thiết.
5.  **Stage timestamp**: Chuyển đổi trường timestamp thành định dạng Unix để Loki có thể xử lý.

## Lợi ích của việc tích hợp GeoIP với Squid Logs

Việc kết hợp thông tin GeoIP với Squid logs mang lại nhiều lợi ích:

1.  **Phân tích phân phối địa lý của người dùng**: Hiểu rõ người dùng của bạn đến từ đâu.
2.  **Phát hiện các mẫu truy cập bất thường**: Xác định các hoạt động đáng ngờ từ các khu vực địa lý không mong đợi.
3.  **Tối ưu hóa hiệu suất CDN**: Điều chỉnh chiến lược phân phối nội dung dựa trên vị trí địa lý của người dùng.

## Trực quan hóa dữ liệu trong Grafana

Sau khi đã cấu hình Promtail để thu thập và làm phong phú dữ liệu logs, bạn có thể sử dụng Grafana để tạo các bảng điều khiển trực quan. Dưới đây là một số ý tưởng cho các biểu đồ và bảng điều khiển:

1.  **Bản đồ nhiệt thế giới**: Hiển thị phân phối lưu lượng truy cập theo quốc gia.
2.  **Top 10 quốc gia/thành phố**: Biểu đồ hiển thị top 10 quốc gia hoặc thành phố có lưu lượng truy cập cao nhất.
3.  **Tỷ lệ cache hit/miss theo khu vực**: So sánh hiệu suất cache giữa các khu vực địa lý khác nhau.
4.  **Lưu lượng theo thời gian và khu vực**: Biểu đồ dòng chảy hiển thị lưu lượng truy cập theo thời gian, phân chia theo khu vực địa lý.
5.  **Mã trạng thái HTTP theo quốc gia**: Phân tích mã trạng thái HTTP (200, 404, 500, v.v.) theo quốc gia để xác định các vấn đề cụ thể của khu vực.

## Kết luận

Việc kết hợp ATS Squid logs với PLG Stack và tích hợp dữ liệu GeoIP mang lại một giải pháp mạnh mẽ để giám sát và phân tích lưu lượng truy cập theo thời gian thực. Thông qua việc trực quan hóa thông tin vị trí địa lý của người dùng, bạn có thể hiểu rõ hơn về mẫu sử dụng, tối ưu hóa hiệu suất CDN và phát hiện các vấn đề tiềm ẩn.

Giải pháp này không chỉ hữu ích cho các hệ thống CDN mà còn áp dụng được cho bất kỳ hệ thống nào sử dụng Apache Traffic Server hoặc các máy chủ proxy khác có khả năng tạo Squid logs.

## Tài liệu tham khảo

1.  [Apache Traffic Server Documentation](https://docs.trafficserver.apache.org/)
2.  [Grafana Loki Documentation](https://grafana.com/docs/loki/latest/)
3.  [MaxMind GeoIP Databases](https://dev.maxmind.com/geoip/geoip2/geolite2/)
4.  [Promtail Pipeline Documentation](https://grafana.com/docs/loki/latest/clients/promtail/pipelines/)
