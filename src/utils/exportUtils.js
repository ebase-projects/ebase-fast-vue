import { parseObject2UrlParam } from '@/utils/webUtils'
import { getToken } from '@/utils/auth'

/**
 * excel 导出工具类
 * @param uri 请求地址 eg:/system/user/export
 * @param fileName 自定义文件名称
 * @param queryParams 查询条件
 */
export function exportExcelUtil(uri, fileName, queryParams) {
  const params = parseObject2UrlParam({
    ...queryParams,
    'access_token': getToken(),
    'fileName': fileName
  })

  // console.log(params)
  window.location.href = `${process.env.VUE_APP_BASE_API}${uri}?${params}`
}

