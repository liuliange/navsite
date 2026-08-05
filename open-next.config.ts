import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 注：当前 @opennextjs/cloudflare 1.20.2 的 incrementalCache 仅支持 "dummy" 或自定义函数。
// 使用 "dummy" 表示不启用 KV 增量缓存，每次请求回源 Notion（链接量小，足够用）。
// 后续如需 KV 缓存，可在此替换为自定义 override 函数并绑定 wrangler 的 KV namespace。
export default defineCloudflareConfig({
  incrementalCache: "dummy",
  tagCache: "dummy",
  queue: "dummy",
});
