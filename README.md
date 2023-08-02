# ihub-management-test
iHub과 github 연동을 위한 test repo 입니다.

## [git REST API header 설정](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api?apiVersion=2022-11-28#using-headers)   
   
## Tree 생성
파일 계층 구조를 생성하는 작업입니다. 새로 생성된 파일이나 변경된 파일의 내용을 업데이트하여 git tree 객체와 디렉토리간에 관계를 형성합니다.
   ### 1. [해당 repo main branch의 최신 커밋 정보를 가져옵니다](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch)

   <img width="1552" alt="스크린샷 2023-08-02 오전 10 45 09" src="https://github.com/bsgp/ihub-management-test/assets/81503846/3d2a133d-1fd1-4e3a-b671-ddbf8e606e23">

   ### 2. [tree 생성](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)
   <img width="1552" alt="스크린샷 2023-08-02 오전 10 52 19" src="https://github.com/bsgp/ihub-management-test/assets/81503846/7eac15f4-0adc-49d3-9734-3ee793a13d73">
       
   - `base_tree` 에 1번에서 받아온 `commit.sha` 를 넣어줍니다.



