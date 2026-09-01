"use client";

import { useEffect } from "react";

import "./globals.css";

// ⚠️ 占位页面：根错误边界机制已接好，视觉未设计。
// 派生项目必须自行设计后才算完成，不得直接上线此占位。
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <main>
          <h1>应用出错了</h1>
          <p>TODO：设计你的错误页面。</p>
          <button type="button" onClick={unstable_retry}>
            重试
          </button>
        </main>
      </body>
    </html>
  );
}
