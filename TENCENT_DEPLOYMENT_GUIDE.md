# 🚀 腾讯云部署指南

本指南帮助您将儿童英语发音练习应用部署到腾讯云，实现中国大陆直接访问，无需 VPN。

## 📋 前置要求

在开始之前，您需要准备：

- ✅ 腾讯云账号（免费注册：https://cloud.tencent.com/register）
- ✅ 已完成实名认证（需要身份证，约 5 分钟）
- ✅ Node.js 环境
- ✅ pnpm 包管理器

---

## 🎯 部署优势

### 为什么选择腾讯云？

✅ **完全免费**：每月有免费额度，足够个人使用  
✅ **国内访问快**：无需 VPN，速度稳定  
✅ **配置简单**：一键部署，无需复杂配置  
✅ **自动扩容**：根据访问量自动调整资源  
✅ **HTTPS 支持**：自动配置 SSL 证书  

---

## 📝 部署步骤

### 步骤 1：注册腾讯云账号

#### 1.1 注册账号

1. 访问：https://cloud.tencent.com/register
2. 填写信息：
   - 手机号
   - 验证码
   - 密码
3. 完成注册

#### 1.2 实名认证

1. 登录后，页面会提示实名认证
2. 选择认证方式：
   - **个人认证**（推荐）
   - 企业认证
3. 上传身份证照片（正反面）
4. 进行人脸识别
5. 等待审核（通常 1-5 分钟）

**注意**：实名认证是必须的，否则无法使用云服务。

---

### 步骤 2：创建腾讯云 API 密钥

#### 2.1 访问 API 密钥管理

1. 访问：https://console.cloud.tencent.com/cam/capi
2. 点击"新建密钥"
3. 或使用子账号密钥（推荐用于生产环境）

#### 2.2 保存密钥信息

**重要**：系统会显示以下信息，**请立即保存**：

```
SecretId: 您的SecretId
SecretKey: 您的SecretKey
```

**⚠️ 注意**：
- 密钥只显示一次，请妥善保管
- 不要泄露给他人
- 建议保存在本地安全的位置

---

### 步骤 3：安装 Serverless CLI

#### 3.1 全局安装 Serverless Framework

```bash
# 使用 npm 安装
npm install -g serverless

# 或使用 pnpm 安装（如果已安装 pnpm）
pnpm add -g serverless
```

#### 3.2 验证安装

```bash
serverless -v
```

应该显示版本号，例如：
```
Framework Core: 3.38.0
Plugin: 7.2.3
SDK: 4.5.3
```

---

### 步骤 4：配置腾讯云凭据

#### 4.1 创建配置目录

```bash
# 在项目根目录执行
mkdir -p ~/.serverless
```

#### 4.2 配置文件

编辑 `~/.serverless/credentials` 文件：

```bash
# 使用文本编辑器打开文件
nano ~/.serverless/credentials
```

#### 4.3 添加腾讯云凭据

在文件中添加以下内容（替换为您的实际密钥）：

```yaml
# 默认凭据
tencent:
  SecretId: 您的SecretId
  SecretKey: 您的SecretKey

# 或使用环境变量（推荐）
# export TENCENT_SECRET_ID=您的SecretId
# export TENCENT_SECRET_KEY=您的SecretKey
```

#### 4.4 保存并退出

如果使用 nano：
- 按 `Ctrl + O` 保存
- 按 `Ctrl + X` 退出

---

### 步骤 5：安装项目依赖

#### 5.1 安装 Serverless 插件

```bash
# 在项目根目录执行
pnpm add -D serverless serverless-nextjs-plugin
```

#### 5.2 验证依赖

检查 `package.json` 中是否包含：
```json
"devDependencies": {
  "serverless": "^x.x.x",
  "serverless-nextjs-plugin": "^x.x.x"
}
```

---

### 步骤 6：配置环境变量（可选）

如果您的应用需要环境变量，可以在 `serverless.yml` 中配置：

```yaml
custom:
  nextComponent:
    component: '@sls-next/serverless-component'
    inputs:
      functionName: learn-english-at-home
      region: ap-guangzhou
      runtime: Nodejs16.13
      timeout: 60
      memorySize: 512
      enableUrl: true
      useContainer: false
      environment:
        # 添加您的环境变量
        COZE_BUCKET_ENDPOINT_URL: ${env:COZE_BUCKET_ENDPOINT_URL}
        COZE_BUCKET_NAME: ${env:COZE_BUCKET_NAME}
```

---

### 步骤 7：部署到腾讯云

#### 7.1 首次部署

```bash
# 在项目根目录执行
pnpm run deploy:tencent
```

**或直接使用**：
```bash
serverless deploy
```

#### 7.2 部署过程

部署过程会：
1. 检测配置文件
2. 构建应用
3. 上传到腾讯云
4. 创建云函数
5. 配置 API 网关
6. 生成访问地址

**预计时间**：3-10 分钟（取决于网络速度）

#### 7.3 部署成功

部署成功后，会显示类似信息：

```
Service Information
service: learn-english-at-home
stage: dev
region: ap-guangzhou

Deployed Functions
  learn-english-at-home

Endpoints
  https://service-xxx-xxx.gz.apigw.tencentcs.com/release/

Full details: https://serverless.tencent.com/xxx
```

**复制访问地址**，例如：
```
https://service-xxx-xxx.gz.apigw.tencentcs.com/release/
```

---

## 🧪 测试部署

### 步骤 1：访问应用

在浏览器中打开部署成功后提供的地址

### 步骤 2：测试功能

测试以下功能：
- ✅ 页面正常显示
- ✅ 单词列表加载
- ✅ 标准发音播放
- ✅ 录音功能
- ✅ AI 评估

---

## 🔄 更新部署

### 当您修改代码后

#### 步骤 1：提交代码

```bash
git add .
git commit -m "更新功能"
git push
```

#### 步骤 2：重新部署

```bash
pnpm run deploy:tencent
```

#### 步骤 3：验证更新

访问应用地址，查看新功能是否生效

---

## 📊 费用说明

### 腾讯云 Serverless 免费额度

每月免费额度：

| 资源 | 免费额度 |
|------|---------|
| **云函数调用次数** | 100 万次/月 |
| **云函数资源使用量** | 40 万 GBs/月 |
| **外网出流量** | 1 GB/月 |
| **公网入流量** | 免费 |
| **API 网关调用次数** | 100 万次/月 |

**说明**：
- ✅ 个人使用完全够用
- ✅ 超出后按量付费，很便宜
- ✅ 每月1号重置免费额度

**预计费用**（超出免费额度后）：
- 云函数：¥0.0000167/GBs
- 调用次数：¥0.0000002/次
- 流量：¥0.8/GB

**实际使用**：
- 假设每天 100 个学生使用
- 每人使用 10 分钟
- 每月费用约：¥5-10

---

## 🛠️ 常见问题

### Q1：部署失败，提示认证错误

**解决方案**：
1. 检查 `~/.serverless/credentials` 中的密钥是否正确
2. 确认密钥没有过期
3. 重新配置密钥

---

### Q2：部署成功但无法访问

**解决方案**：
1. 检查 API 网关是否配置正确
2. 查看云函数日志
3. 确认路径配置正确

---

### Q3：访问速度慢

**解决方案**：
1. 选择离您更近的 region（如 `ap-shanghai`、`ap-beijing`）
2. 修改 `serverless.yml` 中的 `region` 配置
3. 重新部署

---

### Q4：如何查看使用统计

**方法**：
1. 登录腾讯云控制台
2. 访问 Serverless 控制台
3. 查看调用次数、资源使用量等

---

### Q5：如何绑定自定义域名

**步骤**：
1. 在腾讯云控制台购买域名
2. 在 API 网关配置自定义域名
3. 配置 DNS 解析
4. 等待生效

---

## 📚 相关资源

- **腾讯云 Serverless 文档**：https://cloud.tencent.com/document/product/1154
- **Serverless Framework 文档**：https://www.serverless.com/framework/docs/providers/tencent/
- **腾讯云控制台**：https://console.cloud.tencent.com/

---

## 💡 使用建议

### 给老师的建议

1. **测试访问**：
   - 先用自己的手机测试
   - 确认学生能正常访问

2. **分享方式**：
   - 直接分享链接
   - 生成二维码
   - 在微信群分享

3. **监控使用**：
   - 定期查看访问统计
   - 了解学生使用情况

4. **定期更新**：
   - 根据教学进度添加新单词
   - 及时修复问题

---

## 🎯 快速检查清单

部署前确认：

- [ ] 已注册腾讯云账号
- [ ] 已完成实名认证
- [ ] 已创建 API 密钥
- [ ] 已安装 Serverless CLI
- [ ] 已配置腾讯云凭据
- [ ] 已安装项目依赖
- [ ] serverless.yml 配置正确

---

## 🎉 部署成功后

### 分享给学生

```
🎤 儿童英语发音练习

请点击下方链接开始练习：
https://service-xxx-xxx.gz.apigw.tencentcs.com/release/

✓ 国内访问速度快
✓ 无需VPN
✓ 完全免费

包含单词：sheep, pig, horse, cow, rabbit
功能：听发音、录音、AI评估、纠错反馈
```

---

## 🆘 需要帮助？

如果在部署过程中遇到问题：

1. **查看腾讯云文档**
2. **检查部署日志**
3. **查看云函数日志**
4. **随时回来询问我**

---

**祝您部署顺利！** 🚀
