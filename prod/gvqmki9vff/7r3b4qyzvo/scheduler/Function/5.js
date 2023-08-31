module.exports = async (draft, { task }) => {
    draft.response.body = [];
    
    // 10분마다 호출
    // const result2 = await task.addSchedule("get_from_sftp", "get_file_from_sftp", "latest", "0/10 * * * ? *");  //판매오더 스케줄

    // 1시간 마다 호출 - 조이사님 요청
    // const result2 = await task.addSchedule("get_from_sftp", "get_file_from_sftp", "latest", "0 0/1 * * ? *");  //판매오더 스케줄
    
    //1회용
    const result2 = await task.addSchedule("get_from_sftp", "get_file_from_sftp", "latest", "10 4 16 6 ? 2021");  //판매오더 스케줄
    
    draft.response.body.push('get_from_sftp');
}
    