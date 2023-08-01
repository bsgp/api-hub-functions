# ihub-management-test
iHub과 github 연동을 위한 test repo 입니다.


## branch 생성
### 1. [get a reference](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference)
   <img width="1440" alt="스크린샷 2023-08-01 오후 2 49 45" src="https://github.com/bsgp/ihub-management-test/assets/81503846/cdd74a35-242b-4820-abe7-460575f4150f">

### 2. [create a reference](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)
<img width="1440" alt="스크린샷 2023-08-01 오후 2 52 08" src="https://github.com/bsgp/ihub-management-test/assets/81503846/245b3e84-7386-4d37-83e9-f98822eec5bb">


  - body에 `ref`와 `sha`를 보내 줍니다.
  - `ref`에는 새로 만들 branch 명이 들어갑니다. ref로 시작해야 하며 `/`가 최소 2개 들어가야 합니다.
  - `sha`에는 1번에서 받은 응답값 중 `object.sha` 값을 사용합니다.
