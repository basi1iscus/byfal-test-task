# User Binance Price Writer

## Quick start

1. Clone this repo using:
  
  ```shell
  $ git clone git@github.com:basi1iscus/byfal-test-task.git
  ```

2. To install dependencies and clean the git repo run:

  ```shell
  $ npm run install
  ```
3. Copy .env.example file to .env in price_worker folder and make the necessary changes there

4. Build project

  ```shell
  $ npm run build
  ```
5. Run project

  To run controller
  ```shell
  $ npm run start:controller
  ```

  To run worker
  ```shell
  $ npm run start:worker
  ```
#### Docker
Controller server working on 8080 ports on localhost

To run
```shell
docker-compose -f ./docker-compose.yml up
```
To stop
```shell
docker-compose -f ./docker-compose.yml down
```

## Controller API

```Shell
GET /api/v1/symbols - get all symbols in work
PUT /api/v1/symbols/:symbol - add symbol to work
DELETE /api/v1/symbols/:symbol - delete symbol from work
```
