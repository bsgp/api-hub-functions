module.exports = async (draft, { task }) => {
    // 10분마다 호출
    // const result = await task.addSchedule("send_customer_invoice_prod", "call_invoice_to_sftp_prod", "latest", "0/10 * * * ? *"); //인보이스 전송 스케줄

    // 1시간 마다 호출 - 조이사님 요청. 비동기 호출 로 수정
    const result = await task.addSchedule("send_customer_invoice_prod", "call_invoice_to_sftp_prod", "latest", "0 0/1 * * ? *"); //인보이스 전송 스케줄
    draft.response.body.push('Invoice Schedule');
}