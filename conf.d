server {
    listen 80;
    listen [::]:80;
    server_name test-case-aptavis www.test-case-aptavis;

    root /var/www/test-case-aptavis/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}