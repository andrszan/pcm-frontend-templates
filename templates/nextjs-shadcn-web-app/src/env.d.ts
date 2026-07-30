declare namespace NodeJS {
  interface ProcessEnv {
    // API 配置
    NEXT_PUBLIC_API_URL?: string;

    // 应用配置
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_VERSION?: string;
  }
}
