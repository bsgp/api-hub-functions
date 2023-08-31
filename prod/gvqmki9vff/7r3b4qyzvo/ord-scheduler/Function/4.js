module.exports = async (draft, { task }) => {
    // 10분마다 호출
    // const result2 = await task.addSchedule("get_sales_order_prod", "call_edi_order_by_task_prod", "latest", "0/10 * * * ? *");  //판매오더 스케줄

    // 1시간 마다 호출 - 조이사님 요청. 비동기 호출 플로우를 실행시킴
    const result2 = await task.addSchedule("get_sales_order_prod", "call_edi_order_by_task_prod", "latest", "0 0/1 * * ? *");  //판매오더 스케줄
    draft.response.body.push('Order Schedule');
}