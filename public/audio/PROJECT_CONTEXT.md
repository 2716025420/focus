# 💾 项目上下文总结 - VideoMaster × Focus 宣传片

**更新日期**: 2026-04-06\
**项目状态**: 🔄 重新开始 - 新制作方案准备中

***

## 📋 项目基本信息

**项目名称**: VideoMaster × Focus 宣传片\
**项目位置**: `d:\myproject02\promo-studio`\
**视频规格**: 1920x1080 @ 60fps\
**视频时长**: 约 3 分钟\
**风格定位**: Synthwave 科技感、节奏踩点、高级感、娱乐性

***

## 🎯 当前制作方案

### **核心思路**

- ❌ **不要 Logo** - 专注于节奏和踩点
- ✅ **Remotion × 剪映分工** - 发挥各自优势
- ✅ **Synthwave BGM** - Timecop1983 - On the Run
- ✅ **节奏踩点** - 文字动画 + 转场效果配合音乐鼓点

### **分工方案**

| 工具           | 负责内容                   |
| ------------ | ---------------------- |
| **Remotion** | 文字动效、转场效果、装饰元素（透明背景素材） |
| **剪映**       | 主要视频剪辑、配音、调色、字幕        |

***

## 🎵 音乐素材

### **已准备好**

```
文件：d:\myproject02\promo-studio\assets\audio\bgm\02_on_the_run.mp3
艺术家：Timecop1983
曲名：On the Run
风格：Synthwave
时长：约 5 分钟
BPM：105-110（预估）
```

### **备用音乐**

- `01_epic_opening.mp3` (临时使用)

***

## 📂 当前项目结构

```
promo-studio/
├── src/
│   ├── scenes/              ⏳ 空目录，等待新组件
│   ├── utils/
│   │   └── audioSync.ts     ✅ 音频同步工具
│   ├── Root.tsx             ✅ 已更新（显示准备中画面）
│   └── index.tsx            ✅ 正常
├── public/                  ✅ 静态资源目录（Remotion 规范）
│   ├── audio/
│   │   └── bgm/
│   │       ├── 01_epic_opening.mp3   ✅ 备用
│   │       └── 02_on_the_run.mp3     ✅ 主 BGM
│   ├── logos/
│   │   ├── videomaster.svg           ✅ 保留
│   │   └── focus.svg                 ✅ 保留
│   └── screenshots/
│       └── videomaster/              ✅ 已有截图
├── assets/                  ⏳ 源文件目录（可选）
├── output/                  ⏳ 待创建（用于输出素材）
├── MUSIC_REQUIREMENTS.md    ✅ 保留
├── ASSETS_CHECKLIST.md      ✅ 保留
├── REMOTION_TOOLS_GUIDE.md  ✅ 保留
└── PROJECT_CONTEXT.md       ✅ 当前文档
```

***

## ✅ 已完成清理

### **已删除**

- ❌ 所有旧场景文件 (16 个 .tsx 文件)
- ❌ 所有截图素材 (23 张 PNG)
- ❌ SCRIPT.md (已删除)
- ❌ QUICK\_REFERENCE.md (已删除)

### **已保留**

- ✅ 音乐文件 (2 首)
- ✅ Logo 文件 (2 个 SVG)
- ✅ 核心文档 (2 个 MD)

***

## 🎬 待创建内容

### **Remotion 组件**（高优先级）

```
src/scenes/
├── TextFlash.tsx        # 快节奏文字动画
├── Transitions.tsx      # 转场效果包
└── Overlays.tsx         # 装饰元素
```

### **输出素材**（用于剪映）

```
output/
├── text_flash/          # 文字动画（透明背景）
├── transitions/         # 转场效果（透明背景）
└── overlays/            # 装饰元素（透明背景）
```

***

## 📝 下一步行动

### **用户需要做**

1. ⏳ 听音乐 `02_on_the_run.mp3`
2. ⏳ 分析节奏点（前奏、主歌、副歌、间奏、尾奏）
3. ⏳ 确定视频结构想法

### **AI 继续做**

1. ⏳ 创建 TextFlash 文字动画组件
2. ⏳ 创建 Transitions 转场效果组件
3. ⏳ 创建 Overlays 装饰元素组件
4. ⏳ 输出透明背景 MP4 素材

***

## 🎵 音乐节奏分析模板

**待用户填写**：

```
音乐：Timecop1983 - On the Run
BPM：???

节奏结构：
0:00-0:XX  前奏（描述）
0:XX-1:XX  主歌 1（描述）
1:XX-2:XX  副歌（描述）
2:XX-2:XX  间奏（描述）
...

视频结构想法：
0:00-0:15  （内容）
0:15-0:45  （内容）
...
```

***

## 💡 制作要点

### **Remotion 擅长**

- ✅ 程序化文字动画（闪现、缩放、故障）
- ✅ 转场效果（闪白、粒子、光效）
- ✅ 装饰元素（粒子循环、色彩脉冲）
- ✅ 透明背景输出（方便剪映合成）

### **剪映擅长**

- ✅ 主要视频剪辑
- ✅ 节奏把控
- ✅ 配音字幕
- ✅ 调色滤镜

***

## 🔗 有用链接

- **Remotion 文档**: <https://remotion.dev/docs>
- **剪映官网**: <https://www.capcut.cn/>
- **Synthwave 参考**: YouTube 搜索 "Synthwave music"

***

## 🚀 快速开始提示

**打开新窗口后，告诉 AI**：

1. "继续宣传片制作"
2. 提供音乐节奏分析（如果已听完）
3. 或直接说"帮我分析节奏"

**AI 会立即开始创建**：

- TextFlash 组件
- Transitions 组件
- Overlays 组件

***

**项目已清理完毕，准备好接受新思路！** 🎨✨
