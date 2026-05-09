# Baby English（婴儿英语启蒙）

适合手机/平板的离线可安装网页，支持分类点读、自动轮播、家长模式和今日 10 词。

## 本地运行

```powershell
cd d:\workspace\work\selfwork\bbcare
python -m http.server 5500
```

浏览器访问 `http://localhost:5500`。

## 一次性配置：GitHub + Netlify 自动发布

完成后只要向 `main` 分支 push，Netlify 就会自动更新。

### 1) 推送到 GitHub

在 GitHub 创建仓库（例如 `bbcare`），然后本地执行：

```powershell
cd d:\workspace\work\selfwork\bbcare
git init
git add .
git commit -m "init baby english app"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

### 2) 在 Netlify 创建站点（连接 GitHub 仓库）

1. 打开 [Netlify](https://app.netlify.com/) 并登录  
2. New site from Git -> 选择 GitHub -> 选择 `bbcare` 仓库  
3. Build command 留空，Publish directory 设为 `.`  
4. 部署后，在 Site settings -> General 找到 `Site ID`  

### 3) 在 Netlify 创建个人 Access Token

1. 打开 [User settings / Applications](https://app.netlify.com/user/applications)  
2. 生成 `Personal access tokens`  

### 4) 在 GitHub 仓库配置 Secrets

GitHub 仓库 -> Settings -> Secrets and variables -> Actions -> New repository secret：

- `NETLIFY_AUTH_TOKEN`：填刚才的 Netlify token  
- `NETLIFY_SITE_ID`：填站点 Site ID  

项目已自带工作流文件：`.github/workflows/deploy-netlify.yml`。

### 5) 自动发布验证

随便改一个文件并 push 到 `main`，然后在 GitHub 的 Actions 页面看到 `Deploy Baby English to Netlify` 成功即完成。

## 手机/平板安装成 App

- Android (Chrome)：菜单 -> 添加到主屏幕  
- iPhone/iPad (Safari)：分享 -> 添加到主屏幕  

建议每次发版后在手机上强刷一次页面，确保拿到最新缓存。

## 发布验证记录

- 2026-05-09：首次启用 GitHub Actions -> Netlify 自动部署链路。
