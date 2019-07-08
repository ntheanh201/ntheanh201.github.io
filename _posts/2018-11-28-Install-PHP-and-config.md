---
layout: post
title: Cài đặt PHP và các lỗi mình gặp phải
author: ntheanh201
category: 
    - web-development
    - php
summary: Install PHP and Configuration
thumbnail: posts/php.jpg
---

### Cài đặt PHP phiên bản 7.2
Đầu tiên các bạn nên update ubuntu. Sử dụng các câu lệnh:
`
$ sudo apt update
$ sudo apt upgrade
`
##### Cài đặt PHP
Sử dụng terminal: `$ sudo apt install php`
Để kiểm tra xem bạn đã cài thành công PHP chưa, sử dụng câu lệnh: `php -v`
##### Cài đặt các modules của PHP 7.2
`$ sudo apt-get install php-pear php7.2-curl php7.2-dev php7.2-gd php7.2-mbstring php7.2-zip php7.2-mysql php7.2-xml `

Vậy là bạn đã cài xong PHP cho web server cũng như trên local.

### Các lỗi mình hay gặp phải
Nếu các bạn xem phần config server nginx của mình sẽ nhận thấy mình dùng `fastcgi_pass 127.0.0.1:9000;`
Vì thế đối với mình hay xảy ra lỗi 502 Bad Gateway khi server sử dụng php. Vì thế để khắc phục vấn đề này, bạn chỉ cần truy cập: `sudo vim /etc/ph/7.25/fpm/pool.d/www.conf`
Sửa dòng: `listen = /var/run/php-fpm/php-fpm.sock`
thành `listen = 127.0.0.1:9000`