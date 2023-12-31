# ihub-management-test
iHub과 github 연동을 위한 test repo 입니다.

## [git REST API header 설정](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api?apiVersion=2022-11-28#using-headers)   
   
## Tree 생성
파일 계층 구조를 생성하는 작업입니다. 새로 생성된 파일이나 변경된 파일의 내용을 업데이트하여 git tree 객체와 디렉토리간에 관계를 형성합니다.
   ### 1. [해당 branch 최신 커밋 정보를 가져옵니다](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch)

   <img width="1552" alt="스크린샷 2023-08-02 오전 10 45 09" src="https://github.com/bsgp/ihub-management-test/assets/81503846/3d2a133d-1fd1-4e3a-b671-ddbf8e606e23">

   ### 2. [tree 생성](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)
   - `base_tree` 에 1번에서 받아온 `commit.sha` 를 넣어줍니다.
   - branch 생성 후 tree 생성하는 경우에 **Branch 생성** 응답값 `object.sha` 를 `base_tree` 에 넣어준다.
   <img width="1552" alt="스크린샷 2023-08-02 오전 10 52 19" src="https://github.com/bsgp/ihub-management-test/assets/81503846/7eac15f4-0adc-49d3-9734-3ee793a13d73">
       

## [Commit 생성](https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit)
- `parents` 에 **Tree 생성 2번**의 `base_tree` 를 넣어줍니다.
- `tree`에 **Tree 생성 2번**에서 받아온 `sha` 를 넣어줍니다.
<img width="1552" alt="스크린샷 2023-08-02 오전 10 58 47" src="https://github.com/bsgp/ihub-management-test/assets/81503846/7e0347a7-1eb8-45e7-94e4-a6453829ec1a">


## [Branch 생성](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)
- `ref`에 새로 만들어질 branch 명을 입력합니다. (ex: refs/heads/{branch name})
- 커밋 후 새로운 branch 등록하는 경우 `sha`에 **Commit 생성**에서 받아온 `sha` 를 넣어줍니다.
- 커밋 전 새로운 branch 만드는 경우 `sha`에 **Tree 생성 1번**에서 받아온 `commit.sha` 를 넣어줍니다.
<img width="1552" alt="스크린샷 2023-08-02 오전 11 07 16" src="https://github.com/bsgp/ihub-management-test/assets/81503846/87217edf-7738-478a-b912-b3a303f249a7">


## [Branch 업데이트](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference)
- `sha` 에는 **Commit 생성**후 받은 `sha` 를 넣어줍니다.
<img width="1552" alt="스크린샷 2023-08-02 오후 2 51 53" src="https://github.com/bsgp/ihub-management-test/assets/81503846/50faa616-fe4c-4c46-a9ce-4ff29e21fc1a">



## [PR 요청](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#create-a-pull-request)
<img width="1552" alt="스크린샷 2023-08-02 오전 11 16 50" src="https://github.com/bsgp/ihub-management-test/assets/81503846/e24b4fbc-27e3-4ca3-9e9b-13f04d1f6368">

## [PR merge](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#merge-a-pull-request)
- params 에 `PULL_NUMBER`는 **PR 요청**의 응답값 중 `number` 값을 입력합니다.
<img width="1552" alt="스크린샷 2023-08-02 오전 11 32 50" src="https://github.com/bsgp/ihub-management-test/assets/81503846/1c07b0dc-1451-4fe5-a466-f6fe411d1d0f">



## [Contents Upload](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents)
- file upload시 바로 commit이 생성됩니다.
<img width="1552" alt="스크린샷 2023-08-03 오전 10 13 10" src="https://github.com/bsgp/ihub-management-test/assets/81503846/7e04b018-cb0d-4f6d-ab4d-ea2543af3d36">






