import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";
import taskLists from "markdown-it-task-lists";

// ディレクトリ構造からサイドバーを動的に生成する関数
function getDynamicSidebar() {
  const docsRoot = path.join(process.cwd(), "src");
  const sidebar: any[] = [];

  // srcディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(docsRoot)) return sidebar;

  // src直下のディレクトリを動的に取得（.vitepressなどの隠しフォルダは除外）
  const categories = fs
    .readdirSync(docsRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .map((dirent) => dirent.name);

  for (const cat of categories) {
    const catDir = path.join(docsRoot, cat);

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
        text: cat.toUpperCase().replace(/-/g, " "), // ハイフンを全てスペースに置換
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

  // markdown オプションを追加
  markdown: {
    config: (md) => {
      md.use(taskLists, { disabled: true }); // trueにすると閲覧者がチェックを外せなくなる
    },
  },

  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    // 動的に生成したサイドバーを注入
    sidebar: getDynamicSidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/disalice/knowledge-forge" },
    ],
  },
});
