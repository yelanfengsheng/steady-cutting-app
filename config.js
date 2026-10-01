// 静态部署配置（GitHub Pages）。
//
// supabaseUrl / supabasePublishableKey 是「公开值」，被设计成可以直接放在前端：
// 真正的数据隔离由 Supabase 的行级安全策略（RLS）保证，见仓库里的 supabase.sql。
// 所以这个文件可以安全地提交到公开仓库。
//
// 留空 = 自动关闭云同步，App 仍然完全可用，数据存在本机浏览器里。

window.__APP_CONFIG__ = {
  // 例：https://abcdefghijk.supabase.co
  supabaseUrl: "",

  // Supabase 的 publishable key（旧项目里叫 anon key）
  supabasePublishableKey: "",

  // 拍照识别的后端地址。静态部署没有后端，留空即可。
  // 将来接上 Supabase Edge Function 之后填完整 URL，例如：
  // "https://abcdefghijk.supabase.co/functions/v1/recognize-food"
  visionEndpoint: ""
};
