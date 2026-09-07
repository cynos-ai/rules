# 命名规则实施计划

## 规则与验证

1. 在 `docs/rules/project-layout.md` 的需求工件入口补充 [Spec](spec.md) 的默认命名、固定日期与兼容边界，保留 `<change-id>` 占位符供已有命名方式使用。
2. 在 CHANGELOG 记录变更；本需求目录采用新格式，旧需求和阅读副本不改动。
3. 检查新建目录、后续修改/发布、已有项目命名、已有需求编号及旧目录保留五种情况；核对 Markdown 链接、围栏、版本标记及修改范围。

本地验证材料保存到 `/tmp/cynos-change-directory-dates-jS2iKj/`，不加入 Rules 仓库。

规则与验证已完成。`gpt-5.6-luna / max` 的一次独立规则应用检查覆盖上述五种情况，并确认仅用日期无效、内部布局不变，结果均符合预期。静态检查通过，旧目录、历史文件和阅读副本保持不变。

## 发布 1.4.0

用户已授权提交并发布。本次新增兼容的默认命名规则，采用次版本 `1.4.0`；同步 VERSION、AGENTS 托管标记、README 示例和 Changelog，不改动已检查的规则正文。

短期分支直接合入 `develop`，再通过 `develop → main` PR 发布。在 main 合并提交创建 `v1.4.0` 注释 tag 和 GitHub Release，随后同步 develop、删除已合入的短期分支。本地阅读副本和评测材料不随发布推送。

发布前核对 Markdown、链接、版本、Secret 和文件范围；发布后核对远端 tag、Release 与 main/develop。最终发布事实以 [v1.4.0 发布记录](https://github.com/cynos-ai/rules/releases/tag/v1.4.0) 和 Git tag 为准。
