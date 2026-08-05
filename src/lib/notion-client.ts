// 轻量 Notion REST 客户端（基于原生 fetch）。
// 原因：@notionhq/client 依赖 node-fetch，在 Cloudflare Workers(unenv) 运行时
// 会报错 "[unenv] https.request is not implemented yet!"。
// 这里直接用 Workers 原生 fetch 调用 Notion REST API，返回结构与官方 SDK 一致。

const NOTION_API = "https://api.notion.com/v1";

export interface NotionQueryParams {
  database_id: string;
  start_cursor?: string;
  page_size?: number;
  sorts?: unknown[];
  filter?: unknown;
}

export interface NotionPaginatedResponse {
  object: "list";
  results: any[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface NotionDatabaseClient {
  query(params: NotionQueryParams): Promise<NotionPaginatedResponse>;
  retrieve(params: { database_id: string }): Promise<any>;
}

export interface NotionPagesClient {
  retrieve(params: { page_id: string }): Promise<any>;
}

export interface NotionClient {
  databases: NotionDatabaseClient;
  pages: NotionPagesClient;
}

export function createNotionClient(token: string): NotionClient {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };

  const request = async (url: string, init?: RequestInit) => {
    let res: Response;
    try {
      res = await fetch(url, {
        ...init,
        headers: { ...headers, ...(init?.headers || {}) },
      });
    } catch (e) {
      console.error("NOTION_FETCH_FAILED", url, (e as Error)?.message, (e as Error)?.stack);
      throw e;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Notion API ${res.status}: ${text}`);
    }
    return res.json();
  };

  return {
    databases: {
      query: (params: NotionQueryParams) =>
        request(`${NOTION_API}/databases/${params.database_id}/query`, {
          method: "POST",
          body: JSON.stringify({
            start_cursor: params.start_cursor,
            page_size: params.page_size,
            sorts: params.sorts,
            filter: params.filter,
          }),
        }),
      retrieve: (params: { database_id: string }) =>
        request(`${NOTION_API}/databases/${params.database_id}`, {
          method: "GET",
        }),
    },
    pages: {
      retrieve: (params: { page_id: string }) =>
        request(`${NOTION_API}/pages/${params.page_id}`, { method: "GET" }),
    },
  };
}
