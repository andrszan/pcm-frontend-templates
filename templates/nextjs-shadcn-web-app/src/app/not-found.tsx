import Link from "next/link";

// ⚠️ 占位页面：404 兜底机制已接好，视觉未设计。
// 派生项目必须自行设计后才算完成，不得直接上线此占位。
export default function NotFound() {
  return (
    <main className="flex flex-col items-center gap-4 text-center">
      <p className="font-mono text-muted-foreground text-sm">404</p>
      <h1 className="font-semibold text-2xl">页面未找到</h1>
      <p className="text-muted-foreground">TODO：设计你的 404 页面。</p>
      <Link href="/" className="text-primary underline-offset-4 hover:underline">
        返回首页
      </Link>
    </main>
  );
}
