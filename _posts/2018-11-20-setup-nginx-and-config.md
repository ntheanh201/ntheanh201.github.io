---
layout: post
title: Chia sẻ về Nginx và config cấu hình
categories: Technology
tags: nginx
---
### Introduction

Nginx is one of the most popular web servers in the world and is responsible for hosting some of the largest and highest-traffic sites on the internet. It is more resource-friendly than Apache in most cases and can be used as a web server or reverse proxy.
In this guide, we'll discuss how to install Nginx on your Ubuntu 18.04 server.
Theo mình hiểu thì đơn giản Nginx sẽ tạo ra web server trên VPS cũng như trong máy của bạn. Khi bạn đã thành thạo sử dụng Nginx trên local lúc tạo production thì khi đưa sản phẩm deploy lên server (VPS dùng ubuntu,....) thì cũng tựa như vậy.

### Installation

#### Installing Nginx

```sudo apt update
   sudo apt install nginx
```

#### Checking your Nginx

`systemctl status nginx`

```nginx.service - A high-performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2018-04-20 16:08:19 UTC; 3 days ago
     Docs: man:nginx(8)
 Main PID: 2369 (nginx)
    Tasks: 2 (limit: 1153)
   CGroup: /system.slice/nginx.service
           ├─2369 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─2380 nginx: worker process
```

#### Managing your Nginx

```sudo service nginx reload (to reload)
   sudo service nginx start
   sudo service nginx stop
   sudo service nginx restart
```

#### Config

To add your virtual domain on your local: **sudo vim /etc/hosts** and add your local domain you want.

Example: ![
](https://raw.githubusercontent.com/ntheanh201/ntheanh201.github.io/master/images/nginx_server.png)


Terminal **cd /etc/nginx/sites-available** and create your virtual domain.
`sudo vim yourdomain.com`

Then, **sudo chown -R xxx:xxx /var/www** xxx: your ubuntu username and password.

Next, **mkdir /var/www/projects** (projects folder is folder contains your projects)

```mkdir /var/www/projects/yourdomain
   touch /var/www/projects/yourdomain/index.html
```

You can see the default config by using **cat default**
Here is my config (using PHP):

```server{
        listen 80;
        server_name kinn.com;
        access_log /var/www/projects/example/logs/access.log;
        error_log /var/www/projects/example/logs/error.log;
        root /var/www/projects/example/public;
        index index.php index.html;
        location / {
                try_files $uri $uri/ /index.php$args;
        }
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass 127.0.0.1:9000;
        }
    }

```

Enable your site by using **sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/**

`sudo service nginx reload`
    


