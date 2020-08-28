import { parseJson2Url } from '@/utils/webUtils'
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
  // 添加access_token 到url
  p.access_token = getToken()
  p.fileName = fileName
  const params = parseJson2Url(p)
  // 用完后删除access_token
  delete p.access_token
  delete p.fileName
  // console.log(params)
  window.location.href = `${process.env.VUE_APP_BASE_API}${uri}?${params}`
}

