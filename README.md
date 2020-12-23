![](https://github.com/dounine/jb-operator/workflows/Node.js%20CI/badge.svg) ![](https://img.shields.io/github/license/dounine/jb-operator)

# jb-operator
compoment for [jb-base](https://github.com/dounine/jb-base)

## DEV
```
git clone https://github.com/dounine/jb-operator.git
npm install
npm run serve
```
## 部署
不同应用不同端口、或者不同域名

打包
```
npm run build

```
/etc/nginx/conf.d/data.conf
```
server {
    listen       50000;
    server_name 192.168.1.182;
`
    location / {
	root /etc/nginx/conf.d/data;
	index index.html index.htm;
    add_header Cache-Control no-cache;
    add_header Cache-Control private;
    expires -1s;
	try_files $uri $uri/ /index.html;
    }
}
```
复制
```
cp -rf dist/* /etc/nginx/conf.d/data 
``