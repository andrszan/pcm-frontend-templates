import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Home() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl">模板已启动</h1>
        </CardTitle>
        <CardDescription>基于 Vite、React、React Router 和 shadcn/ui 的单页应用基础模板。</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        从 <code className="font-mono text-foreground">src/routes/home/page.tsx</code> 开始构建应用。
      </CardContent>
    </Card>
  )
}
