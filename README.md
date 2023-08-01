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

## commit 만들기
### 1. [default branch 정보 가져오기](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch)
<img width="1440" alt="스크린샷 2023-08-01 오후 4 47 25" src="https://github.com/bsgp/ihub-management-test/assets/81503846/ead4493e-30a4-41c9-a2e6-4e3f1bb867d8">

### 2. [tree 생성](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)
<img width="1440" alt="스크린샷 2023-08-01 오후 4 51 18" src="https://github.com/bsgp/ihub-management-test/assets/81503846/851accd4-ddba-45ca-a4ee-19118fc70490">

   - body의 `base_tree`는 1번 응답값 `commit.commit.tree.sha` 입니다.

### 3. [commit 생성](https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit)
<img width="1440" alt="스크린샷 2023-08-01 오후 4 55 32" src="https://github.com/bsgp/ihub-management-test/assets/81503846/f257fc10-947b-4bc4-8733-4d3fab2b1a5f">

   - body의 `tree` 값은 2번 응답의 `sha` 값 입니다. `parent` 값은 1번 응답의 `commit.sha` 값 입니다.

