"use client";

import { useEffect } from "react";

// ⚠️ 占位页面：错误边界机制已接好，视觉未设计。
// 派生项目必须自行设计后才算完成，不得直接上线此占位。
export default function ErrorBoundary({
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
    <main className="flex flex-col items-center gap-4 text-center">
      <h1 className="font-semibold text-2xl">出错了</h1>
      <p className="text-muted-foreground">TODO：设计你的错误页面。</p>
      <button type="button" onClick={unstable_retry} className="text-primary underline-offset-4 hover:underline">
        重试
      </button>
    </main>
  );
}
