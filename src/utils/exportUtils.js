import { parseJson2Url } from '@/utils/webUtils'
import { getToken } from '@/utils/auth'
import { addDateRange } from '@/utils/commonUtils'

/**
 * excel 导出工具类
 * @param uri eg:/system/user/export
 * @param queryParams
 * @param dateRange
 */
export function exportExcelUtil(uri, queryParams, dateRange) {
  const p = addDateRange(queryParams, dateRange)
  // 添加access_token 到url
  p.access_token = getToken()
  const params = parseJson2Url(p)
  // 用完后删除access_token
  delete p.access_token
  // console.log(params)
  window.location.href = `${process.env.VUE_APP_BASE_API}${uri}?${params}`
}

