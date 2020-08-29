import { parseObject2UrlParam } from '@/utils/webUtils'
import { getToken } from '@/utils/auth'
import { addDateRange } from '@/utils/commonUtils'

/**
 * excel 导出工具类
 * @param uri 请求地址 eg:/system/user/export
 * @param fileName 自定义文件名称
 * @param queryParams 查询条件
 * @param dateRange 日期范围
 */
export function exportExcelUtil(uri, fileName, queryParams, dateRange) {
  const p = addDateRange(queryParams, dateRange)

  const params = parseObject2UrlParam({
    ...p,
    'access_token': getToken(),
    'fileName': fileName
  })

  // console.log(params)
  window.location.href = `${process.env.VUE_APP_BASE_API}${uri}?${params}`
}

