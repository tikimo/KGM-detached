# KGM Nettilaji - Titeenien taistot 2023 Hosted by Digit ry
Kadonneen Gambitin Metsästys nettipeli titeenit tapahtumaan. 

Authors: Tijam Moradi [@tikimo](https://github.com/tikimo) & Hugo Hutri [@hugohutri](https://github.com/hugohutri)

## Dockerisation

## Build using docker compose
```bash
docker-compose -f compose-tijam-dockerhub.yaml build
```

This way you get two images:
1. `tijam/kgm:front` as frontend
2. `tijam/kgm:back` as backend

### Verify images
`docker images`
```bash
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
tijam/kgm    back      32b35d99d65a   2 minutes ago    297MB
tijam/kgm    front     e421c45f17d1   16 minutes ago   42.2MB
```

Now run locally or push to dockerhub.

## A: Run locally
### Frontend
Attach `host:4200` to `container:80` by running:
```bash
docker run --name kgm-frontend -d -it -p 127.0.0.1:4200:80/tcp tijam/kgm:front
```

### Backend
Attach `host:3086` to `container:3086` by running:
```bash
docker run --name kgm-backend -d -it -p 127.0.0.1:3086:3086/tcp tijam/kgm:back
```

## B: Push to Dockerhub (requires login or token)
Login to Docker Hub with `docker login`

First make sure you have used docker-compose's build command (found earlier in this md).

Push using:
```bash
docker-compose -f compose-tijam-dockerhub.yaml push
```

## Pull on server
Pull front and backend on separate commands:
```bash
sudo docker pull tijam/kgm:back 
```
```bash
sudo docker pull tijam/kgm:front 
```

## Remove old containers
Get container id with ```docker ps```. 
Stop containers
```bash
docker stop <backend id> <frontend id>
```
Remove containers
```bash
docker rm <backend id> <frontend id>
```

## Run on server
### Frontend
Attach `host:4200` to `container:80` by running:
```bash
sudo docker run -d -it -p 127.0.0.1:4200:80/tcp tijam/kgm:front
```

### Backend
Attach `host:3086` to `container:3086` by running:
```bash
sudo docker run -d -it -p 127.0.0.1:3086:3086/tcp tijam/kgm:back
```
Verify that everything is running with:
```bash
sudo docker ps
```
```bash
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                      NAMES
2e1d013ab47c   tijam/kgm:back    "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   127.0.0.1:3086->3086/tcp   kgm-backend
185a4c2ae210   tijam/kgm:front   "/docker-entrypoint.…"   9 seconds ago   Up 8 seconds   127.0.0.1:4200->80/tcp     kgm-frontend
```

## Setup host machine Nginx reverse proxy
Note: this sample setup is on a host machine that already has Nginx that routes multipel other applications. In this case, the KGM frontend and backend containers are not the only stuff running on the host. The KGM frontend container already ahs its own Nginx, so use that as standalone if possible.
Note2: After putting 
### Conf files
Put following nginx conf files in /etc/nginx/sites-available
Then create symbolic link to /etc/nginx/sites-enabled with:
```bash
sudo ln -s /etc/nginx/sites-available/api.ikuinenheinakuu.fi.conf /etc/nginx/sites-enabled/api.ikuinenhe inakuu.fi.conf
```
Expected result:
```bash
tijam@ubuntu-8gb-hel1-2:/etc/nginx/sites-available$ ll ../sites-enabled/
total 8.0K
drwxr-xr-x 2 root root 4.0K Jan 11 12:24 ./
drwxr-xr-x 8 root root 4.0K Jan 11 12:25 ../
lrwxrwxrwx 1 root root   54 Jan 11 12:24 api.ikuinenheinakuu.fi.conf -> /etc/nginx/sites-available/api.ikuinenheinakuu.fi.conf
lrwxrwxrwx 1 root root   50 Jul 15 11:50 ikuinenheinakuu.fi.conf -> /etc/nginx/sites-available/ikuinenheinakuu.fi.conf  
```

### API 
```nginx configuration
server {                                                                                          
    server_name api.ikuinenheinakuu.fi;                                                           
    root /var/www/ikuinenheinakuu.fi;                                                             
                                                                                                  
    location / {                                                                                  
        proxy_pass http://localhost:3086;                                                         
     }                                                                                            
                                                                                                  
    listen 443 ssl; # managed by Certbot                                                          
    ssl_certificate /etc/letsencrypt/live/ikuinenheinakuu.fi/fullchain.pem; # managed by Certbot  
    ssl_certificate_key /etc/letsencrypt/live/ikuinenheinakuu.fi/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot                         
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot                                                                                                    
}                                                                                                 
server {                                                                                          
    if ($host = api.ikuinenheinakuu.fi) {                                                         
        return 301 https://$host$request_uri;                                                     
    } # managed by Certbot                                                                        
                                                                                                   
    listen 80;                                                                                    
    server_name api.ikuinenheinakuu.fi;                                                           
    return 404; # managed by Certbot                                                                                      
}                                                                                                 
```

### Frontend
```nginx configuration
server {
     server_name ikuinenheinakuu.fi www.ikuinenheinakuu.fi;
    root /var/www/ikuinenheinakuu.fi;

    location / {
        proxy_pass http://localhost:4200;
     }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ikuinenheinakuu.fi/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ikuinenheinakuu.fi/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot




}
server {
    if ($host = www.ikuinenheinakuu.fi) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = ikuinenheinakuu.fi) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
     server_name ikuinenheinakuu.fi www.ikuinenheinakuu.fi;
    return 404; # managed by Certbot
}
```
Test and validate the configuration with
```bash
sudo nginx -t
```

### Certbot
To get SSL, expand the server cert with 
```bash
sudo certbot --nginx
```

Validate nginx again:
```bash
sudo nginx -t
```

### Rerun nginx to load new config
```bash
sudo service nginx restart
```

Navigate to url (ikuinenheinakuu.fi etc) and see result.
If not visible, make sure docker containers are running. You can use cURL command on the host to see if it works within the machine:
```bash
curl localhost:3086
```
