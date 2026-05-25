import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

// ディレクトリ構造からサイドバーを動的に生成する関数
function getDynamicSidebar() {
  // .vitepress から見たドキュメントルート (dist/human/)
  const docsRoot = path.join(process.cwd(), "src");

  // 対象とするカテゴリ（ディレクトリ名）の一覧
  const categories = [
    "api-design",
    "database-design",
    "application-design",
    "security-design",
  ];
  const sidebar: any[] = [];

  for (const cat of categories) {
    const catDir = path.join(docsRoot, cat);

    // ディレクトリが存在しない場合はスキップ
    if (!fs.existsSync(catDir)) continue;

    // ディレクトリ内の .md ファイルを取得（index.md は除外）
    const files = fs
      .readdirSync(catDir)
      .filter((f) => f.endsWith(".md") && f !== "index.md");

    const items = files.map((file) => {
      const fullPath = path.join(catDir, file);
      const content = fs.readFileSync(fullPath, "utf-8");

      // Markdownから title フロントマターを正規表現で簡易抽出
      const titleMatch = content.match(/title:\s*([^\n]+)/);
      const title = titleMatch
        ? titleMatch[1].trim().replace(/['"]/g, "")
        : file.replace(".md", "");

      return {
        text: title,
        link: `/${cat}/${file.replace(".md", "")}`,
      };
    });

    if (items.length > 0) {
      sidebar.push({
        text: cat.toUpperCase().replace("-", " "),
        items: items,
      });
    }
  }
  return sidebar;
}

export default defineConfig({
  base: "/knowledge-forge/",
  title: "Knowledge Forge",
  description: "Engineering Best Practices",
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    // 動的に生成したサイドバーを注入
    sidebar: getDynamicSidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/disalice/knowledge-forge" },
    ],
  },
});
